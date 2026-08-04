/**
 * ============================================================
 * ADMIN SHEETS — view otomatis untuk admin (bukan sumber data utama)
 * ============================================================
 * 3 tab ini AUTO-DIBUAT kalau belum ada (tidak perlu setup manual):
 *   - "Belum Buat Report"  : [Teacher, Student, Materi, Checkpoint]
 *   - "Sudah Buat Report"  : [Teacher, Student, Materi, Checkpoint]
 *   - "Streak Tidak Hadir" : [Teacher, Kelas, Student, Absen 1, Absen 2, ...]
 *
 * 2 sheet pertama SELALU ditulis ulang total (bukan di-update sebagian)
 * setiap ada perubahan relevan — supaya selalu 100% sinkron dengan data
 * asli di tab Student, tidak akan pernah "nyasar"/beda data. Sumber
 * kebenaran TETAP di tab Student (kolom Lesson X/Report X) — 2 sheet ini
 * murni tampilan baca-saja untuk admin, jangan diedit manual di sini.
 * ============================================================
 */

// Ambil sheet by name, kalau belum ada langsung dibuat + isi header.
function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ------------------------------------------------------------
// SYNC "Belum Buat Report" & "Sudah Buat Report"
// ------------------------------------------------------------
function syncAdminReportSheets_(ss) {
  const studentRows = ss.getSheetByName(TABS.STUDENT).getDataRange().getValues();
  const header = studentRows[0];
  const colIndex = buildStudentColumnIndex_(header);
  const teacherByKelas = buildKelasTeacherMap_(ss);

  const belumRows = [];
  const sudahRows = [];

  for (let i = 1; i < studentRows.length; i++) {
    const kelas = studentRows[i][1], student = studentRows[i][2], course = studentRows[i][3];
    const teacher = teacherByKelas[kelas] || '(tidak diketahui)';
    const isSelesaiTotal = colIndex.selesai !== -1 && isTrue_(studentRows[i][colIndex.selesai]);

    CHECKPOINTS.forEach(cp => {
      const lessonCol = colIndex['lesson' + cp];
      const reportCol = colIndex['report' + cp];
      if (lessonCol === -1 || reportCol === -1) return; // kolom belum ada, skip

      const lessonVal = studentRows[i][lessonCol];
      const reportVal = studentRows[i][reportCol];
      if (!lessonVal) return; // checkpoint ini belum tercapai sama sekali

      if (isTrue_(reportVal)) {
        sudahRows.push([teacher, student, course, cp]);
      } else if (!isSelesaiTotal) {
        // kalau course sudah ditandai "Selesai" total, jangan tampilkan
        // sebagai "belum" lagi — konsisten dengan computePendingCheckpoint_
        belumRows.push([teacher, student, course, cp]);
      }
    });
  }

  writeAdminSheet_(ss, TABS.ADMIN_BELUM, ['Teacher', 'Student', 'Materi', 'Checkpoint'], belumRows);
  writeAdminSheet_(ss, TABS.ADMIN_SUDAH, ['Teacher', 'Student', 'Materi', 'Checkpoint'], sudahRows);
}

function writeAdminSheet_(ss, name, headers, rows) {
  const sheet = getOrCreateSheet_(ss, name, headers);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

// Bangun map Kelas -> Teacher sekali jalan (dari tab Jadwal), lebih
// efisien daripada findTeacherForClass_ dipanggil berkali-kali dalam loop.
function buildKelasTeacherMap_(ss) {
  const rows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  const map = {};
  for (let i = 1; i < rows.length; i++) {
    const teacher = rows[i][0], kelas = rows[i][2];
    if (kelas && !map[kelas]) map[kelas] = teacher;
  }
  return map;
}

// ------------------------------------------------------------
// STREAK TIDAK HADIR
// ------------------------------------------------------------

// Dipanggil dari tombol manual "🚫 Tidak Hadir" di halaman Daily Report.
function markAbsentAction(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'student']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  markAbsent_(ss, payload.teacher, payload.kelas, payload.student);
  return { success: true };
}

function markAbsent_(ss, teacher, kelas, student) {
  const sheet = getOrCreateSheet_(ss, TABS.ABSENSI, ['Teacher', 'Kelas', 'Student']);
  const rows = sheet.getDataRange().getValues();

  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) { rowIndex = i; break; }
  }

  if (rowIndex === -1) {
    // Belum pernah absen sebelumnya — tambah baris baru
    sheet.appendRow([teacher, kelas, student]);
    writeNextAbsentTimestamp_(sheet, sheet.getLastRow());
    return;
  }

  writeNextAbsentTimestamp_(sheet, rowIndex + 1); // +1 karena rows[] 0-based, sheet 1-based
}

// Cari kolom kosong pertama (mulai kolom D / index 4) di baris tertentu,
// pastikan header "Absen N" ada, lalu tulis timestamp sekarang di situ.
function writeNextAbsentTimestamp_(sheet, rowNum) {
  const lastCol = Math.max(sheet.getLastColumn(), 3);
  const rowValues = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];

  let targetCol = -1;
  for (let c = 3; c < rowValues.length; c++) { // index 3 = kolom D (0-based)
    if (!rowValues[c]) { targetCol = c + 1; break; }
  }
  if (targetCol === -1) targetCol = lastCol + 1; // semua kolom terisi, tambah kolom baru

  // Pastikan header "Absen N" ada di kolom ini
  const headerCell = sheet.getRange(1, targetCol);
  if (!headerCell.getValue()) {
    headerCell.setValue(`Absen ${targetCol - 3}`);
  }

  sheet.getRange(rowNum, targetCol).setValue(new Date());
}

// Dipanggil setiap kali guru submit Daily Report normal untuk siswa
// tsb (artinya siswa hadir) — hapus SEMUA timestamp absen di barisnya
// (bukan hapus barisnya, biar riwayat Teacher/Kelas/Student tetap ada
// untuk tracking selanjutnya). Kalau siswa ini belum pernah tercatat
// absen sama sekali, fungsi ini tidak melakukan apa-apa (aman).
function clearAbsentStreak_(ss, kelas, student) {
  const sheet = ss.getSheetByName(TABS.ABSENSI);
  if (!sheet) return; // belum pernah ada yang absen sama sekali, tidak masalah

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) {
      const lastCol = sheet.getLastColumn();
      if (lastCol >= 4) {
        sheet.getRange(i + 1, 4, 1, lastCol - 3).clearContent();
      }
      return;
    }
  }
}
