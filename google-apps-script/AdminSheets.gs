/**
 * ============================================================
 * ADMIN SHEETS — view read-only untuk admin (bukan sumber data utama)
 * ============================================================
 */

function syncAdminReportSheets_(ss, preloaded) {
  const data = preloaded || readStudentSheet_(ss);
  const studentRows = data.rows;
  const colIndex = data.colIndex;

  const belumRows = [];
  const sudahRows = [];

  for (let i = 1; i < studentRows.length; i++) {
    const teacher = colIndex.teacher !== -1 ? studentRows[i][colIndex.teacher] : '(tidak diketahui)';
    const kelas = studentRows[i][colIndex.kelas];
    const namaPanggilan = colIndex.namaPanggilan !== -1 ? studentRows[i][colIndex.namaPanggilan] : studentRows[i][colIndex.namaLengkap];
    const course = studentRows[i][colIndex.course];
    const isSelesaiTotal = colIndex.selesai !== -1 && isTrue_(studentRows[i][colIndex.selesai]);

    CHECKPOINTS.forEach(cp => {
      const lessonCol = colIndex['lesson' + cp], reportCol = colIndex['report' + cp];
      if (lessonCol === -1 || reportCol === -1) return;
      const lessonVal = studentRows[i][lessonCol], reportVal = studentRows[i][reportCol];
      if (!lessonVal) return;

      if (isTrue_(reportVal)) {
        sudahRows.push([teacher, namaPanggilan, course, cp]);
      } else if (!isSelesaiTotal) {
        belumRows.push([teacher, namaPanggilan, course, cp]);
      }
    });
  }

  writeAdminSheet_(ss, TABS.ADMIN_BELUM, ['Teacher', 'Student', 'Materi', 'Checkpoint'], belumRows);
  writeAdminSheet_(ss, TABS.ADMIN_SUDAH, ['Teacher', 'Student', 'Materi', 'Checkpoint'], sudahRows);
}

function writeAdminSheet_(ss, name, headers, rows) {
  const sheet = getOrCreateSheet_(ss, name, headers);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

// ------------------------------------------------------------
// STREAK TIDAK HADIR
// ------------------------------------------------------------
function markAbsentAction(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'namaLengkap']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  markAbsent_(ss, payload.teacher, payload.kelas, payload.namaLengkap, payload.namaPanggilan);
  return { success: true };
}

function markAbsent_(ss, teacher, kelas, namaLengkap, namaPanggilan) {
  const sheet = getOrCreateSheet_(ss, TABS.ABSENSI, ['Teacher', 'Kelas', 'Nama Lengkap', 'Nama Panggilan']);
  const rows = sheet.getDataRange().getValues();

  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === namaLengkap) { rowIndex = i; break; }
  }

  if (rowIndex === -1) {
    sheet.appendRow([teacher, kelas, namaLengkap, namaPanggilan || namaLengkap]);
    writeNextAbsentTimestamp_(sheet, sheet.getLastRow());
    return;
  }
  writeNextAbsentTimestamp_(sheet, rowIndex + 1);
}

function writeNextAbsentTimestamp_(sheet, rowNum) {
  const lastCol = Math.max(sheet.getLastColumn(), 4);
  const rowValues = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];

  let targetCol = -1;
  for (let c = 4; c < rowValues.length; c++) { // index 4 = kolom E (0-based), setelah Nama Panggilan
    if (!rowValues[c]) { targetCol = c + 1; break; }
  }
  if (targetCol === -1) targetCol = lastCol + 1;

  const headerCell = sheet.getRange(1, targetCol);
  if (!headerCell.getValue()) headerCell.setValue(`Absen ${targetCol - 4}`);
  sheet.getRange(rowNum, targetCol).setValue(new Date());
}

function clearAbsentStreak_(ss, kelas, namaLengkap) {
  const sheet = ss.getSheetByName(TABS.ABSENSI);
  if (!sheet) return;
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === namaLengkap) {
      const lastCol = sheet.getLastColumn();
      if (lastCol >= 5) sheet.getRange(i + 1, 5, 1, lastCol - 4).clearContent();
      return;
    }
  }
}

// ------------------------------------------------------------
// KELOLA MURID — lihat semua kelas guru, tambah/hapus siswa/kelas
// ------------------------------------------------------------

// Ambil SEMUA kelas + murid milik 1 guru, dikelompokkan per hari.
// DI-CACHE 60 detik (CacheService) — baca 7 sheet sekaligus itu berat,
// cache bikin buka-tutup tab / klik ulang jadi instan. Cache otomatis
// dibuang (invalidate) begitu ada add/hapus murid/kelas.
function getClassesForTeacher(teacher) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'classes_' + teacher;
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const result = {};

  HARI_LIST.forEach(hari => {
    const sheet = ss.getSheetByName(hari);
    if (!sheet) { result[hari] = {}; return; }

    const rows = sheet.getDataRange().getValues();
    const classMap = {};
    for (let i = 1; i < rows.length; i++) {
      const [rTeacher, rKelas, rNamaLengkap, rNamaPanggilan] = rows[i];
      if (!rKelas) continue;
      if (String(rTeacher).trim().toLowerCase() !== String(teacher).trim().toLowerCase()) continue;
      if (!classMap[rKelas]) classMap[rKelas] = [];
      classMap[rKelas].push({ namaLengkap: rNamaLengkap, namaPanggilan: rNamaPanggilan });
    }
    result[hari] = classMap;
  });

  const response = { success: true, hari: result };
  cache.put(cacheKey, JSON.stringify(response), 60);
  return response;
}

function invalidateClassesCache_(teacher) {
  CacheService.getScriptCache().remove('classes_' + teacher);
}
function invalidateJadwalCache_(teacher, hari) {
  CacheService.getScriptCache().remove(`jadwal_${teacher}_${hari}`);
}

// Tambah siswa: kalau ada data siswa dengan Nama Lengkap PERSIS SAMA di
// tab "Pindah" (pernah dipindahkan dari kelas lain), riwayatnya (course,
// lesson, checkpoint) DIPULIHKAN ke kelas baru ini — bukan mulai dari nol.
// Kalau tidak ketemu, baris baru kosong seperti biasa.
function addStudentAction(payload) {
  validatePayload_(payload, ['teacher', 'hari', 'kelas', 'namaLengkap', 'namaPanggilan']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  if (HARI_LIST.indexOf(payload.hari) === -1) {
    throw new Error(`Hari "${payload.hari}" tidak valid. Harus salah satu dari: ${HARI_LIST.join(', ')}.`);
  }

  // 1. Sheet hari (roster sederhana)
  const jadwalSheet = getOrCreateSheet_(ss, payload.hari, JADWAL_HEADERS);
  const jadwalRows = jadwalSheet.getDataRange().getValues();
  for (let i = 1; i < jadwalRows.length; i++) {
    if (jadwalRows[i][1] === payload.kelas && jadwalRows[i][2] === payload.namaLengkap) {
      throw new Error(`Siswa "${payload.namaLengkap}" sudah terdaftar di kelas "${payload.kelas}" hari ${payload.hari}.`);
    }
  }
  jadwalSheet.appendRow([payload.teacher, payload.kelas, payload.namaLengkap, payload.namaPanggilan]);

  // 2. Cek tab "Pindah" — ada riwayat lama dengan Nama Lengkap sama?
  const restored = restoreFromPindahIfExists_(ss, payload);

  if (!restored) {
    // Tidak ada riwayat — baris baru kosong seperti biasa
    const studentSheet = getOrCreateSheet_(ss, TABS.STUDENT, buildFullStudentHeaders_());
    const newRow = new Array(studentSheet.getLastColumn() || STUDENT_BASE_HEADERS.length).fill('');
    const colIndex = buildStudentColumnIndex_(studentSheet.getRange(1, 1, 1, studentSheet.getLastColumn()).getValues()[0]);
    if (colIndex.hari !== -1) newRow[colIndex.hari] = payload.hari;
    if (colIndex.kelas !== -1) newRow[colIndex.kelas] = payload.kelas;
    if (colIndex.teacher !== -1) newRow[colIndex.teacher] = payload.teacher;
    if (colIndex.namaLengkap !== -1) newRow[colIndex.namaLengkap] = payload.namaLengkap;
    if (colIndex.namaPanggilan !== -1) newRow[colIndex.namaPanggilan] = payload.namaPanggilan;
    studentSheet.appendRow(newRow);
  }

  ensureLogLaporanRow_(ss, payload.teacher, payload.hari, payload.kelas, payload.namaLengkap);

  invalidateClassesCache_(payload.teacher);
  invalidateJadwalCache_(payload.teacher, payload.hari);
  return { success: true, restored: restored };
}

// Cari & pulihkan baris dari tab "Pindah" berdasarkan Nama Lengkap PERSIS
// SAMA (case-insensitive, trim). Kalau ketemu: pindahkan barisnya ke tab
// Student dengan Hari/Kelas/Teacher/Nama Panggilan yang BARU (checkpoint
// & riwayat lain tetap seperti semula), lalu hapus dari tab Pindah.
function restoreFromPindahIfExists_(ss, payload) {
  const pindahSheet = ss.getSheetByName(TABS.PINDAH);
  if (!pindahSheet) return false;

  const rows = pindahSheet.getDataRange().getValues();
  if (rows.length < 2) return false;
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);
  if (colIndex.namaLengkap === -1) return false;

  const targetName = String(payload.namaLengkap).trim().toLowerCase();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][colIndex.namaLengkap]).trim().toLowerCase() !== targetName) continue;

    const restoredRow = rows[i].slice();
    if (colIndex.hari !== -1) restoredRow[colIndex.hari] = payload.hari;
    if (colIndex.kelas !== -1) restoredRow[colIndex.kelas] = payload.kelas;
    if (colIndex.teacher !== -1) restoredRow[colIndex.teacher] = payload.teacher;
    if (colIndex.namaPanggilan !== -1) restoredRow[colIndex.namaPanggilan] = payload.namaPanggilan;

    const studentSheet = getOrCreateSheet_(ss, TABS.STUDENT, buildFullStudentHeaders_());
    studentSheet.appendRow(restoredRow);
    pindahSheet.deleteRow(i + 1);
    return true;
  }
  return false;
}

// Hapus 1 siswa. mode='drop' (default) -> arsip ke tab Drop (permanen,
// tidak akan otomatis kepulihkan). mode='pindah' -> arsip ke tab Pindah
// (kalau nanti ada guru manapun tambah siswa dengan Nama Lengkap sama,
// otomatis dipulihkan riwayatnya).
function removeStudentAction(payload) {
  validatePayload_(payload, ['hari', 'kelas', 'namaLengkap']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const mode = payload.mode === 'pindah' ? 'pindah' : 'drop';
  const targetTab = mode === 'pindah' ? TABS.PINDAH : TABS.DROP;

  const studentSheet = ss.getSheetByName(TABS.STUDENT);
  const studentRows = studentSheet.getDataRange().getValues();
  const header = studentRows[0];
  const colIndex = buildStudentColumnIndex_(header);
  const rowIdx = findStudentRowIndex_(studentRows, colIndex, payload.kelas, payload.namaLengkap);
  let teacherOfRow = null;

  if (rowIdx !== -1) {
    teacherOfRow = colIndex.teacher !== -1 ? studentRows[rowIdx][colIndex.teacher] : null;
    const archiveSheet = getOrCreateSheet_(ss, targetTab, header);
    archiveSheet.appendRow(studentRows[rowIdx]);
    studentSheet.deleteRow(rowIdx + 1);
  }

  removeFromJadwalSheet_(ss, payload.hari, payload.kelas, payload.namaLengkap);

  if (teacherOfRow) {
    invalidateClassesCache_(teacherOfRow);
    invalidateJadwalCache_(teacherOfRow, payload.hari);
  }
  return { success: true, mode: mode };
}

// Hapus 1 kelas UTUH (semua siswanya) — dipakai saat kelas pindah tangan
// ke guru lain. Selalu diarsipkan ke tab "Pindah" (bukan Drop), supaya
// kalau guru baru nanti tambah siswa yang sama namanya, riwayatnya balik
// otomatis. Sengaja tanpa opsi lain (sesuai permintaan: simpel saja).
function removeClassAction(payload) {
  validatePayload_(payload, ['hari', 'kelas']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const studentSheet = ss.getSheetByName(TABS.STUDENT);
  const studentRows = studentSheet.getDataRange().getValues();
  const header = studentRows[0];
  const colIndex = buildStudentColumnIndex_(header);
  const pindahSheet = getOrCreateSheet_(ss, TABS.PINDAH, header);

  const teachersAffected = new Set();
  // Loop dari bawah supaya aman saat deleteRow (index tidak berubah untuk baris di atasnya)
  for (let i = studentRows.length - 1; i >= 1; i--) {
    if (studentRows[i][colIndex.kelas] !== payload.kelas || studentRows[i][colIndex.hari] !== payload.hari) continue;
    if (colIndex.teacher !== -1 && studentRows[i][colIndex.teacher]) teachersAffected.add(studentRows[i][colIndex.teacher]);
    pindahSheet.appendRow(studentRows[i]);
    studentSheet.deleteRow(i + 1);
  }

  const jadwalSheet = ss.getSheetByName(payload.hari);
  if (jadwalSheet) {
    const jadwalRows = jadwalSheet.getDataRange().getValues();
    for (let i = jadwalRows.length - 1; i >= 1; i--) {
      if (jadwalRows[i][1] === payload.kelas) jadwalSheet.deleteRow(i + 1);
    }
  }

  teachersAffected.forEach(t => { invalidateClassesCache_(t); invalidateJadwalCache_(t, payload.hari); });
  return { success: true };
}

function removeFromJadwalSheet_(ss, hari, kelas, namaLengkap) {
  const jadwalSheet = ss.getSheetByName(hari);
  if (!jadwalSheet) return;
  const jadwalRows = jadwalSheet.getDataRange().getValues();
  for (let i = jadwalRows.length - 1; i >= 1; i--) {
    if (jadwalRows[i][1] === kelas && jadwalRows[i][2] === namaLengkap) {
      jadwalSheet.deleteRow(i + 1);
      break;
    }
  }
}

function buildFullStudentHeaders_() {
  const headers = STUDENT_BASE_HEADERS.slice();
  CHECKPOINTS.forEach(cp => {
    headers.push('Lesson ' + cp, 'Report ' + cp, 'Last Reminder ' + cp);
  });
  return headers;
}
