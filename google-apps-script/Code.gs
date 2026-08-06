/**
 * ============================================================
 * TIMEDOOR REPORT GENERATOR — BACKEND (Google Apps Script)
 * ============================================================
 * SETUP WAJIB — lihat PANDUAN.md & TODO.md untuk detail lengkap.
 *
 * PERUBAHAN STRUKTUR BESAR (Kelola Murid update):
 * - Tab `Jadwal` TUNGGAL sudah TIDAK DIPAKAI LAGI. Diganti 7 tab
 *   terpisah per hari: "Senin","Selasa","Rabu","Kamis","Jumat",
 *   "Sabtu","Minggu" — masing-masing kolom: Teacher, Kelas,
 *   Nama Lengkap, Nama Panggilan.
 * - Tab `Student` sekarang WAJIB kolom (nama header persis):
 *   Hari, Kelas, Teacher, Nama Lengkap, Nama Panggilan, Criteria,
 *   Course, Lesson sekarang, Status Lesson, Selesai,
 *   Lesson 8, Report 8, Last Reminder 8, ... s/d checkpoint 48.
 *   "Nama Lengkap" = KUNCI pencocokan data (unik). "Nama Panggilan"
 *   = dipakai di teks laporan (WA/PDF), bisa jadi sama antar siswa.
 * - Tab `Drop` (arsip siswa yang dihapus dari Kelola Murid) — auto
 *   dibuat, struktur sama persis dengan tab Student.
 * ============================================================
 */

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    telegramToken: props.getProperty('TELEGRAM_TOKEN'),
    mainSheetId: props.getProperty('MAIN_SHEET_ID'),
    examSheetIds: {
      Junior: props.getProperty('JUNIOR_SHEET_ID'),
      Kids: props.getProperty('KIDS_SHEET_ID'),
      Teens: props.getProperty('TEENS_SHEET_ID'),
    },
    adminChatId: props.getProperty('ADMIN_CHAT_ID'),
  };
}

const TABS = {
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  LOG: 'Log_Laporan',
  DROP: 'Drop',
  PINDAH: 'Pindah',
  ADMIN_BELUM: 'Belum Buat Report',
  ADMIN_SUDAH: 'Sudah Buat Report',
  ABSENSI: 'Streak Tidak Hadir',
};

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const CHECKPOINTS = [8, 16, 24, 32, 40, 48];

// Header lengkap tab Student, dipakai saat auto-create baris/kolom baru.
const STUDENT_BASE_HEADERS = [
  'Hari', 'Kelas', 'Teacher', 'Nama Lengkap', 'Nama Panggilan',
  'Criteria', 'Course', 'Lesson sekarang', 'Status Lesson', 'Selesai',
];
const JADWAL_HEADERS = ['Teacher', 'Kelas', 'Nama Lengkap', 'Nama Panggilan'];

// ------------------------------------------------------------
// ENTRY POINT (semua action lewat GET — lihat catatan di js/api.js
// soal kenapa POST dihindari untuk Web App ini)
// ------------------------------------------------------------
function doGet(e) {
  const p = e.parameter;
  let result;

  try {
    switch (p.action) {
      case 'login':
        result = handleLogin(p.pin);
        break;
      case 'getTeachers':
        result = getTeacherNames();
        break;
      case 'getJadwal':
        result = getJadwalForTeacher(p.teacher, p.hari);
        break;
      case 'getPendingExams':
        result = getPendingExamsForTeacher(p.teacher);
        break;
      case 'getExamTemplate':
        result = getExamTemplateText(p.criteria, p.course, parseInt(p.lesson, 10), p.namaPanggilan, {
          literacy: p.gradeLiteracy, application: p.gradeApplication, character: p.gradeCharacter,
        });
        break;
      case 'getAIExamText':
        result = generateAIExamTexts(p.course, parseInt(p.lesson, 10), p.namaPanggilan, JSON.parse(p.objectives || '[]'), {
          literacy: p.gradeLiteracy, application: p.gradeApplication, character: p.gradeCharacter,
        });
        break;
      case 'getStudentInfo':
        result = getStudentLatestInfo(p.kelas, p.namaLengkap);
        break;
      case 'submitDailyReport':
        result = submitDailyReport({
          teacher: p.teacher, hari: p.hari, kelas: p.kelas,
          namaLengkap: p.namaLengkap, namaPanggilan: p.namaPanggilan,
          criteria: p.criteria, course: p.course, lesson: p.lesson,
          status: p.status, noteText: p.noteText,
        });
        break;
      case 'submitExamReport':
        result = submitExamReport({
          teacher: p.teacher, kelas: p.kelas, namaLengkap: p.namaLengkap,
          criteria: p.criteria, course: p.course, noteText: p.noteText,
        });
        break;
      case 'markReportDone':
        result = markReportDoneAction({ kelas: p.kelas, namaLengkap: p.namaLengkap });
        break;
      case 'requestReminder':
        result = requestReminder({ teacher: p.teacher, kelas: p.kelas, namaLengkap: p.namaLengkap });
        break;
      case 'markAbsent':
        result = markAbsentAction({ teacher: p.teacher, kelas: p.kelas, namaLengkap: p.namaLengkap, namaPanggilan: p.namaPanggilan });
        break;
      case 'getClassesForTeacher':
        result = getClassesForTeacher(p.teacher);
        break;
      case 'addStudent':
        result = addStudentAction({
          teacher: p.teacher, hari: p.hari, kelas: p.kelas,
          namaLengkap: p.namaLengkap, namaPanggilan: p.namaPanggilan,
        });
        break;
      case 'removeStudent':
        result = removeStudentAction({ hari: p.hari, kelas: p.kelas, namaLengkap: p.namaLengkap, mode: p.mode });
        break;
      case 'removeClass':
        result = removeClassAction({ hari: p.hari, kelas: p.kelas });
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + p.action };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------
function handleLogin(pin) {
  const sheet = SpreadsheetApp.openById(getConfig_().mainSheetId).getSheetByName(TABS.TEACHER);
  const rows = sheet.getDataRange().getValues();
  const trimmedPin = String(pin).trim();
  if (!trimmedPin) return { success: false, error: 'PIN kosong.' };

  const matches = [];
  for (let i = 1; i < rows.length; i++) {
    const rowPin = String(rows[i][1]).trim();
    const isActive = String(rows[i][3]).toUpperCase() === 'TRUE';
    if (isActive && rowPin === trimmedPin) matches.push(String(rows[i][0]).trim());
  }
  if (matches.length === 0) return { success: false, error: 'PIN tidak ditemukan.' };
  if (matches.length > 1) return { success: false, error: `PIN ini terdaftar untuk lebih dari 1 guru (${matches.join(', ')}). Hubungi admin.` };
  return { success: true, teacher: matches[0] };
}

function getTeacherNames() {
  const sheet = SpreadsheetApp.openById(getConfig_().mainSheetId).getSheetByName(TABS.TEACHER);
  const rows = sheet.getDataRange().getValues();
  const names = [];
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][3]).toUpperCase() === 'TRUE') names.push(rows[i][0]);
  }
  return { success: true, teachers: names };
}

function getTeacherEmail_(ss, teacher) {
  const rows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();
  const emailCol = findColumnIndex_(rows[0], 'Email');
  if (emailCol === -1) return null;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(teacher).toLowerCase()) return rows[i][emailCol] || null;
  }
  return null;
}

// ------------------------------------------------------------
// HELPERS UMUM
// ------------------------------------------------------------
function findColumnIndex_(header, targetName) {
  const target = String(targetName).replace(/\s+/g, ' ').trim().toLowerCase();
  for (let i = 0; i < header.length; i++) {
    if (String(header[i] || '').replace(/\s+/g, ' ').trim().toLowerCase() === target) return i;
  }
  return -1;
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isTrue_(v) {
  return v === true || String(v).toUpperCase() === 'TRUE';
}

function validatePayload_(payload, requiredFields) {
  if (!payload) throw new Error('Payload kosong.');
  const missing = requiredFields.filter(f => !payload[f] && payload[f] !== 0);
  if (missing.length > 0) throw new Error(`Field wajib belum diisi: ${missing.join(', ')}`);
}

// Bangun index kolom tab Student sekali per pemanggilan berdasarkan
// nama header (bukan posisi tetap) — supaya tahan terhadap perubahan
// urutan kolom di spreadsheet.
function buildStudentColumnIndex_(header) {
  const idx = {
    hari: findColumnIndex_(header, 'Hari'),
    kelas: findColumnIndex_(header, 'Kelas'),
    teacher: findColumnIndex_(header, 'Teacher'),
    namaLengkap: findColumnIndex_(header, 'Nama Lengkap'),
    namaPanggilan: findColumnIndex_(header, 'Nama Panggilan'),
    criteria: findColumnIndex_(header, 'Criteria'),
    course: findColumnIndex_(header, 'Course'),
    lessonSekarang: findColumnIndex_(header, 'Lesson sekarang'),
    statusLesson: findColumnIndex_(header, 'Status Lesson'),
    selesai: findColumnIndex_(header, 'Selesai'),
  };
  CHECKPOINTS.forEach(cp => {
    idx['lesson' + cp] = findColumnIndex_(header, 'Lesson ' + cp);
    idx['report' + cp] = findColumnIndex_(header, 'Report ' + cp);
    idx['reminder' + cp] = findColumnIndex_(header, 'Last Reminder ' + cp);
  });
  return idx;
}

function findStudentRowIndex_(rows, colIndex, kelas, namaLengkap) {
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][colIndex.kelas] === kelas && rows[i][colIndex.namaLengkap] === namaLengkap) return i;
  }
  return -1;
}

// ------------------------------------------------------------
// JADWAL (7 sheet per hari) & DAILY REPORT
// ------------------------------------------------------------
function getJadwalForTeacher(teacher, hari) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `jadwal_${teacher}_${hari}`;
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const jadwalSheet = ss.getSheetByName(hari);
  if (!jadwalSheet) return { success: true, kelas: {} };

  const jadwalRows = jadwalSheet.getDataRange().getValues();
  const studentSheet = ss.getSheetByName(TABS.STUDENT);
  const studentRows = studentSheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(studentRows[0]);

  const studentIndex = {};
  for (let i = 1; i < studentRows.length; i++) {
    const key = `${studentRows[i][colIndex.hari]}|${studentRows[i][colIndex.kelas]}|${studentRows[i][colIndex.namaLengkap]}`;
    studentIndex[key] = {
      course: studentRows[i][colIndex.course],
      lesson: studentRows[i][colIndex.lessonSekarang],
      namaPanggilan: studentRows[i][colIndex.namaPanggilan],
    };
  }

  const classMap = {};
  for (let i = 1; i < jadwalRows.length; i++) {
    const [rTeacher, rKelas, rNamaLengkap, rNamaPanggilan] = jadwalRows[i];
    if (!rKelas) continue;
    if (String(rTeacher).trim().toLowerCase() !== String(teacher).trim().toLowerCase()) continue;

    if (!classMap[rKelas]) classMap[rKelas] = [];
    const extra = studentIndex[`${hari}|${rKelas}|${rNamaLengkap}`] || {};
    classMap[rKelas].push({
      namaLengkap: rNamaLengkap,
      namaPanggilan: extra.namaPanggilan || rNamaPanggilan || rNamaLengkap,
      course: extra.course || '',
      lesson: extra.lesson || '',
    });
  }
  const response = { success: true, kelas: classMap };
  cache.put(cacheKey, JSON.stringify(response), 30); // 30 detik — cukup pendek supaya tidak kelamaan basi
  return response;
}

function submitDailyReport(payload) {
  validatePayload_(payload, ['teacher', 'hari', 'kelas', 'namaLengkap', 'course', 'lesson']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  // OPTIMASI: baca tab Student SEKALI di sini, dipakai ulang oleh semua
  // sub-fungsi di bawah (sebelumnya tiap fungsi baca sendiri² -> tab
  // Student yang sekarang 28 kolom kebaca 3x dalam 1 request, lambat).
  const studentSheet = ss.getSheetByName(TABS.STUDENT);
  const studentData = { sheet: studentSheet, rows: studentSheet.getDataRange().getValues() };
  studentData.colIndex = buildStudentColumnIndex_(studentData.rows[0]);

  updateStudentRow_(ss, payload, studentData);
  updateLogRow_(ss, payload, 'Daily', payload.noteText || '');
  clearAbsentStreak_(ss, payload.kelas, payload.namaLengkap);

  const lessonNum = parseInt(payload.lesson, 10);
  if (CHECKPOINTS.indexOf(lessonNum) !== -1) {
    markLessonCheckpoint_(ss, payload.kelas, payload.namaLengkap, lessonNum, studentData);
  }

  syncAdminReportSheets_(ss, studentData);
  invalidateJadwalCache_(payload.teacher, payload.hari);
  return { success: true };
}

function updateStudentRow_(ss, payload, preloaded) {
  const data = preloaded || readStudentSheet_(ss);
  const { sheet, rows, colIndex } = data;
  const i = findStudentRowIndex_(rows, colIndex, payload.kelas, payload.namaLengkap);
  if (i === -1) throw new Error(`Siswa "${payload.namaLengkap}" (${payload.kelas}) tidak ditemukan di tab Student.`);

  const rowNum = i + 1;
  if (colIndex.course !== -1) { sheet.getRange(rowNum, colIndex.course + 1).setValue(payload.course); rows[i][colIndex.course] = payload.course; }
  if (colIndex.lessonSekarang !== -1) { sheet.getRange(rowNum, colIndex.lessonSekarang + 1).setValue(payload.lesson); rows[i][colIndex.lessonSekarang] = payload.lesson; }
  if (colIndex.criteria !== -1 && payload.criteria) { sheet.getRange(rowNum, colIndex.criteria + 1).setValue(payload.criteria); rows[i][colIndex.criteria] = payload.criteria; }
  if (colIndex.statusLesson !== -1 && payload.status) { const lbl = mapStatusLabel_(payload.status); sheet.getRange(rowNum, colIndex.statusLesson + 1).setValue(lbl); rows[i][colIndex.statusLesson] = lbl; }
}

// Helper: baca tab Student 1x, return {sheet, rows, colIndex} — dipakai
// fungsi manapun yang belum dapat data ter-preload dari caller-nya.
function readStudentSheet_(ss) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  return { sheet, rows, colIndex };
}

function mapStatusLabel_(status) {
  if (status === 'done' || status === 'double') return 'Completed';
  if (status === 'in_progress' || status === 'one_and_half') return 'On Going';
  return status || '';
}

function getStudentLatestInfo(kelas, namaLengkap) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  const i = findStudentRowIndex_(rows, colIndex, kelas, namaLengkap);
  if (i === -1) return { success: false, error: `Siswa "${namaLengkap}" (${kelas}) tidak ditemukan.` };

  return {
    success: true,
    course: rows[i][colIndex.course] || '',
    lesson: rows[i][colIndex.lessonSekarang] || '',
    criteria: colIndex.criteria !== -1 ? (rows[i][colIndex.criteria] || '') : '',
    namaPanggilan: colIndex.namaPanggilan !== -1 ? (rows[i][colIndex.namaPanggilan] || '') : namaLengkap,
  };
}

// ------------------------------------------------------------
// EXAM REPORT
// ------------------------------------------------------------
function submitExamReport(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'namaLengkap', 'course']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  const i = findStudentRowIndex_(rows, colIndex, payload.kelas, payload.namaLengkap);
  if (i === -1) throw new Error(`Siswa "${payload.namaLengkap}" (${payload.kelas}) tidak ditemukan di tab Student.`);

  const fullPayload = Object.assign({}, payload, { hari: rows[i][colIndex.hari] });
  updateLogRow_(ss, fullPayload, 'Exam', payload.noteText || '');

  const result = markReportDone_(ss, payload.kelas, payload.namaLengkap);
  return { success: true, checkpoint: result.checkpoint };
}

function markReportDoneAction(payload) {
  validatePayload_(payload, ['kelas', 'namaLengkap']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const result = markReportDone_(ss, payload.kelas, payload.namaLengkap);
  return { success: true, checkpoint: result.checkpoint };
}

function markReportDone_(ss, kelas, namaLengkap) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  const i = findStudentRowIndex_(rows, colIndex, kelas, namaLengkap);
  if (i === -1) throw new Error(`Siswa "${namaLengkap}" (${kelas}) tidak ditemukan di tab Student.`);

  const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
  if (!checkpoint) throw new Error(`Tidak ada checkpoint Exam Report yang pending untuk siswa "${namaLengkap}" (${kelas}).`);
  const reportCol = colIndex['report' + checkpoint];
  if (reportCol === -1) throw new Error(`Kolom "Report ${checkpoint}" tidak ditemukan di tab Student.`);

  sheet.getRange(i + 1, reportCol + 1).setValue(true);
  syncAdminReportSheets_(ss);
  return { checkpoint };
}

function requestReminder(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'namaLengkap']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  const i = findStudentRowIndex_(rows, colIndex, payload.kelas, payload.namaLengkap);
  if (i === -1) throw new Error(`Siswa "${payload.namaLengkap}" (${payload.kelas}) tidak ditemukan.`);

  const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
  if (!checkpoint) throw new Error(`Siswa "${payload.namaLengkap}" tidak sedang punya checkpoint pending.`);
  const courseVal = rows[i][colIndex.course];
  const namaPanggilan = colIndex.namaPanggilan !== -1 ? (rows[i][colIndex.namaPanggilan] || payload.namaLengkap) : payload.namaLengkap;

  const teacherEmail = getTeacherEmail_(ss, payload.teacher);
  if (teacherEmail) {
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    CalendarApp.getDefaultCalendar().createEvent(
      `📌 Reminder: Buat Exam Report — ${namaPanggilan}`,
      start, end,
      {
        description: `Siswa ${namaPanggilan} (${payload.kelas}, ${courseVal}) sudah mencapai checkpoint Lesson ${checkpoint}.`,
        guests: teacherEmail, sendInvites: true,
      }
    );
  }

  notifyTeacherExamDue_(payload.teacher, namaPanggilan, payload.kelas, courseVal, checkpoint);
  return { success: true, checkpoint, calendarCreated: !!teacherEmail };
}

// ------------------------------------------------------------
// PENDING EXAMS
// ------------------------------------------------------------
function getPendingExamsForTeacher(teacher) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);

  const pending = [];
  for (let i = 1; i < rows.length; i++) {
    if (colIndex.teacher !== -1 && String(rows[i][colIndex.teacher]).toLowerCase() !== String(teacher).toLowerCase()) continue;
    const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
    if (checkpoint) {
      pending.push({
        kelas: rows[i][colIndex.kelas],
        namaLengkap: rows[i][colIndex.namaLengkap],
        namaPanggilan: colIndex.namaPanggilan !== -1 ? rows[i][colIndex.namaPanggilan] : rows[i][colIndex.namaLengkap],
        course: rows[i][colIndex.course],
        lesson: checkpoint,
      });
    }
  }
  return { success: true, pending };
}

function computePendingCheckpoint_(row, colIndex) {
  if (colIndex.selesai !== -1 && isTrue_(row[colIndex.selesai])) return null;
  for (let i = 0; i < CHECKPOINTS.length; i++) {
    const cp = CHECKPOINTS[i];
    const lessonCol = colIndex['lesson' + cp], reportCol = colIndex['report' + cp];
    if (lessonCol === -1 || reportCol === -1) continue;
    if (row[lessonCol] && !isTrue_(row[reportCol])) return cp;
  }
  return null;
}

function markLessonCheckpoint_(ss, kelas, namaLengkap, lessonNum, preloaded) {
  const data = preloaded || readStudentSheet_(ss);
  const { sheet, rows, colIndex } = data;
  const i = findStudentRowIndex_(rows, colIndex, kelas, namaLengkap);
  if (i === -1) return { justMarked: false, reason: 'siswa tidak ditemukan' };
  if (colIndex.selesai !== -1 && isTrue_(rows[i][colIndex.selesai])) return { justMarked: false, reason: 'course sudah Selesai' };

  const lessonCol = colIndex['lesson' + lessonNum];
  if (lessonCol === -1) return { justMarked: false, reason: `kolom Lesson ${lessonNum} tidak ada` };
  if (rows[i][lessonCol]) return { justMarked: false, reason: 'sudah pernah ditandai' };

  const now = new Date();
  sheet.getRange(i + 1, lessonCol + 1).setValue(now);
  rows[i][lessonCol] = now; // jaga array in-memory tetap sinkron buat caller berikutnya (syncAdminReportSheets_)
  return { justMarked: true, checkpoint: lessonNum };
}

// ------------------------------------------------------------
// LOG_LAPORAN
// ------------------------------------------------------------
function updateLogRow_(ss, payload, columnName, noteText) {
  const sheet = ss.getSheetByName(TABS.LOG);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const hariCol = findColumnIndex_(header, 'Hari');
  const kelasCol = findColumnIndex_(header, 'Kelas');
  const namaCol = findColumnIndex_(header, 'Nama Lengkap') !== -1 ? findColumnIndex_(header, 'Nama Lengkap') : findColumnIndex_(header, 'Student');
  const courseCol = findColumnIndex_(header, 'Course');
  const lessonCol = findColumnIndex_(header, 'Lesson sekarang');
  const targetCol = findColumnIndex_(header, columnName);
  const criteriaCol = findColumnIndex_(header, 'Criteria');

  if (targetCol === -1) throw new Error(`Kolom "${columnName}" tidak ditemukan di header tab Log_Laporan.`);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][hariCol] === payload.hari && rows[i][kelasCol] === payload.kelas && rows[i][namaCol] === payload.namaLengkap) {
      if (courseCol !== -1) sheet.getRange(i + 1, courseCol + 1).setValue(payload.course);
      if (lessonCol !== -1) sheet.getRange(i + 1, lessonCol + 1).setValue(payload.lesson);
      sheet.getRange(i + 1, targetCol + 1).setValue(noteText);
      if (criteriaCol !== -1 && payload.criteria) sheet.getRange(i + 1, criteriaCol + 1).setValue(payload.criteria);
      return;
    }
  }
  throw new Error(`Baris untuk siswa "${payload.namaLengkap}" (${payload.kelas}, ${payload.hari}) tidak ditemukan di tab Log_Laporan.`);
}

// ------------------------------------------------------------
// TELEGRAM
// ------------------------------------------------------------
function sendTelegramMessage_(chatId, text) {
  const token = getConfig_().telegramToken;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: { chat_id: chatId, text: text, parse_mode: 'HTML' },
    muteHttpExceptions: true,
  });
}

function notifyTeacherExamDue_(teacher, namaPanggilan, kelas, course, checkpoint) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const rows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(teacher).toLowerCase()) {
      const chatId = rows[i][2];
      if (chatId) {
        sendTelegramMessage_(chatId, `📌 <b>Pengingat Exam Report</b>\n${namaPanggilan} (${kelas}) sudah menyelesaikan Lesson ${checkpoint} di ${course}.\nTolong buatkan Exam Report-nya ya!`);
      }
      return;
    }
  }
}

// ------------------------------------------------------------
// CRON — 1x/hari jam 08:00. Reminder pertama 3 hari setelah checkpoint,
// lalu diulang tiap 3 hari sekali.
// ------------------------------------------------------------
function cronReminderKelipatan8() {
  const config = getConfig_();
  const ss = SpreadsheetApp.openById(config.mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const colIndex = buildStudentColumnIndex_(rows[0]);
  const now = new Date();
  const belumDibuatList = [];
  const REMINDER_INTERVAL_DAYS = 3;

  for (let i = 1; i < rows.length; i++) {
    const kelas = rows[i][colIndex.kelas];
    const namaPanggilan = colIndex.namaPanggilan !== -1 ? rows[i][colIndex.namaPanggilan] : rows[i][colIndex.namaLengkap];
    const course = rows[i][colIndex.course];
    const teacher = colIndex.teacher !== -1 ? rows[i][colIndex.teacher] : null;
    const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
    if (!checkpoint) continue;

    const lessonDate = rows[i][colIndex['lesson' + checkpoint]];
    const reminderCol = colIndex['reminder' + checkpoint];
    const lastReminded = reminderCol !== -1 ? rows[i][reminderCol] : null;

    const daysPending = lessonDate ? (now - new Date(lessonDate)) / 86400000 : 0;
    belumDibuatList.push(`- ${namaPanggilan} (${kelas}, ${course}, Lesson ${checkpoint}, ${Math.floor(daysPending)} hari)`);

    const daysSinceReminder = lastReminded ? (now - new Date(lastReminded)) / 86400000 : daysPending;
    if (daysPending >= REMINDER_INTERVAL_DAYS && daysSinceReminder >= REMINDER_INTERVAL_DAYS) {
      if (teacher) {
        const teacherRow = findTeacherRow_(ss, teacher);
        if (teacherRow && teacherRow.chatId) {
          sendTelegramMessage_(teacherRow.chatId, `⏰ <b>Reminder Exam Report</b>\n${namaPanggilan} (${kelas}) di ${course} masih menunggu Exam Report Lesson ${checkpoint} kamu. Sudah ${Math.floor(daysPending)} hari.`);
        }
      }
      if (reminderCol !== -1) sheet.getRange(i + 1, reminderCol + 1).setValue(now);
    }
  }

  if (belumDibuatList.length > 0 && config.adminChatId) {
    sendTelegramMessage_(config.adminChatId, `📋 <b>Rekap Semua Siswa Belum Exam Report</b>\n${belumDibuatList.join('\n')}`);
  }
}

function findTeacherRow_(ss, teacherName) {
  const rows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(teacherName).toLowerCase()) {
      return { name: rows[i][0], chatId: rows[i][2] };
    }
  }
  return null;
}
