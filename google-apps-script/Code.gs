/**
 * ============================================================
 * TIMEDOOR REPORT GENERATOR — BACKEND (Google Apps Script)
 * ============================================================
 * Ini adalah SATU-SATUNYA backend project ini. Tidak ada server
 * lain, tidak ada biaya. Deploy sebagai Web App (Execute as: Me,
 * Who has access: Anyone), lalu pakai URL-nya di frontend.
 *
 * SETUP WAJIB (sebelum deploy):
 * 1. Script Properties (Project Settings ⚙️):
 *      TELEGRAM_TOKEN     = token bot dari BotFather
 *      MAIN_SHEET_ID      = ID spreadsheet "Input data"
 *      JUNIOR_SHEET_ID    = ID spreadsheet "JUNIORS report templates"
 *      KIDS_SHEET_ID      = ID spreadsheet "KIDS report templates"
 *      TEENS_SHEET_ID     = ID spreadsheet "TEENS report templates"
 *      ADMIN_CHAT_ID      = Chat ID Telegram admin
 *
 * 2. Tab `Student` WAJIB punya kolom-kolom ini (nama header persis,
 *    toleran spasi ekstra/huruf besar-kecil):
 *      Hari, Kelas, Student, Course, Lesson sekarang, Criteria,
 *      Status Lesson, Selesai,
 *      Lesson 8, Report 8, Last Reminder 8,
 *      Lesson 16, Report 16, Last Reminder 16,
 *      Lesson 24, Report 24, Last Reminder 24,
 *      Lesson 32, Report 32, Last Reminder 32,
 *      Lesson 40, Report 40, Last Reminder 40,
 *      Lesson 48, Report 48, Last Reminder 48
 *    (Kalau ada kolom yang belum ditambahkan, fitur terkait kolom itu
 *    akan di-skip dengan aman, tidak bikin error fatal.)
 *
 * 3. Tab `Teacher` WAJIB punya kolom "Email" (Gmail guru) untuk fitur
 *    "Ingatkan Report" (Calendar invite).
 *
 * 4. Deploy > New deployment > Web app > Execute as "Me", Access "Anyone".
 * 5. Time-driven Trigger untuk `cronReminderKelipatan8` — jalankan
 *    1-2x/hari (2x/hari supaya mode eskalasi setelah 7 hari beneran
 *    bisa kirim 2x sehari, bukan cuma 1x).
 * ============================================================
 */

// ------------------------------------------------------------
// KONFIGURASI
// ------------------------------------------------------------
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
  JADWAL: 'Jadwal',
  STUDENT: 'Student',
  LOG: 'Log_Laporan',
};

// Checkpoint kelipatan-8 yang di-track. Course terpanjang = 48 lesson.
const CHECKPOINTS = [8, 16, 24, 32, 40, 48];

// ------------------------------------------------------------
// ENTRY POINTS
// ------------------------------------------------------------
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'login':
        result = handleLogin(e.parameter.pin);
        break;
      case 'getTeachers':
        result = getTeacherNames();
        break;
      case 'getJadwal':
        result = getJadwalForTeacher(e.parameter.teacher, e.parameter.hari);
        break;
      case 'getPendingExams':
        result = getPendingExamsForTeacher(e.parameter.teacher);
        break;
      case 'getExamTemplate':
        result = getExamTemplateText(
          e.parameter.criteria,
          e.parameter.course,
          parseInt(e.parameter.lesson, 10),
          e.parameter.student,
          {
            literacy: e.parameter.gradeLiteracy,
            application: e.parameter.gradeApplication,
            character: e.parameter.gradeCharacter,
          }
        );
        break;
      case 'getStudentInfo':
        result = getStudentLatestInfo(e.parameter.kelas, e.parameter.student);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case 'submitDailyReport':
        result = submitDailyReport(body.payload);
        break;
      case 'submitExamReport':
        result = submitExamReport(body.payload);
        break;
      case 'markReportDone':
        result = markReportDoneAction(body.payload);
        break;
      case 'requestReminder':
        result = requestReminder(body.payload);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + body.action };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
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
    const row = rows[i];
    const rowPin = String(row[1]).trim();
    const isActive = String(row[3]).toUpperCase() === 'TRUE';
    if (isActive && rowPin === trimmedPin) matches.push(String(row[0]).trim());
  }

  if (matches.length === 0) return { success: false, error: 'PIN tidak ditemukan.' };
  if (matches.length > 1) {
    return { success: false, error: `PIN ini terdaftar untuk lebih dari 1 guru (${matches.join(', ')}). Hubungi admin untuk perbaiki PIN di tab Teacher.` };
  }
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

// ------------------------------------------------------------
// JADWAL
// ------------------------------------------------------------
function getJadwalForTeacher(teacher, hari) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const jadwalRows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  const studentRows = ss.getSheetByName(TABS.STUDENT).getDataRange().getValues();

  const studentIndex = {};
  for (let i = 1; i < studentRows.length; i++) {
    const [sHari, sKelas, sStudent, sCourse, sLesson] = studentRows[i];
    studentIndex[`${sHari}|${sKelas}|${sStudent}`] = { course: sCourse, lesson: sLesson };
  }

  const classMap = {};
  for (let i = 1; i < jadwalRows.length; i++) {
    const [rTeacher, rHari, rKelas, rStudent] = jadwalRows[i];
    if (String(rTeacher).trim().toLowerCase() !== String(teacher).trim().toLowerCase()) continue;
    if (String(rHari).trim().toLowerCase() !== String(hari).trim().toLowerCase()) continue;

    if (!classMap[rKelas]) classMap[rKelas] = [];
    const extra = studentIndex[`${rHari}|${rKelas}|${rStudent}`] || {};
    classMap[rKelas].push({ nama: rStudent, course: extra.course || '', lesson: extra.lesson || '' });
  }

  return { success: true, kelas: classMap };
}

// ------------------------------------------------------------
// SUBMIT DAILY REPORT
// payload: { teacher, hari, kelas, student, criteria, course, lesson, status, noteText }
// ------------------------------------------------------------
function submitDailyReport(payload) {
  validatePayload_(payload, ['teacher', 'hari', 'kelas', 'student', 'course', 'lesson']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  updateStudentRow_(ss, payload.hari, payload.kelas, payload.student, payload.course, payload.lesson, payload.criteria, payload.status);
  updateLogRow_(ss, payload, 'Daily', payload.noteText || '');

  const lessonNum = parseInt(payload.lesson, 10);
  if (CHECKPOINTS.indexOf(lessonNum) !== -1) {
    const marked = markLessonCheckpoint_(ss, payload.kelas, payload.student, lessonNum);
    if (marked.justMarked) {
      notifyTeacherExamDue_(payload.teacher, payload.student, payload.kelas, payload.course, lessonNum);
    }
  }

  return { success: true };
}

// ------------------------------------------------------------
// SUBMIT EXAM REPORT (dari tab Exam Report)
// ------------------------------------------------------------
function submitExamReport(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'student', 'course']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const hari = findHariForStudent_(ss, payload.kelas, payload.student);
  if (!hari) {
    throw new Error(`Tidak bisa menentukan hari untuk siswa "${payload.student}" di kelas "${payload.kelas}". Pastikan siswa ini terdaftar di tab Student.`);
  }
  const fullPayload = Object.assign({}, payload, { hari });
  updateLogRow_(ss, fullPayload, 'Exam', payload.noteText || '');

  const result = markReportDone_(ss, payload.kelas, payload.student);
  return { success: true, checkpoint: result.checkpoint };
}

// ------------------------------------------------------------
// MANUAL: tombol "Report Telah Selesai" di halaman Daily Report.
// ------------------------------------------------------------
function markReportDoneAction(payload) {
  validatePayload_(payload, ['kelas', 'student']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const result = markReportDone_(ss, payload.kelas, payload.student);
  return { success: true, checkpoint: result.checkpoint };
}

// ------------------------------------------------------------
// MANUAL: tombol "Ingatkan Report" — Calendar invite + Telegram double-check.
// ------------------------------------------------------------
function requestReminder(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'student']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  let checkpoint = null, courseVal = '';
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === payload.kelas && rows[i][2] === payload.student) {
      checkpoint = computePendingCheckpoint_(rows[i], colIndex);
      courseVal = rows[i][3];
      break;
    }
  }
  if (!checkpoint) {
    throw new Error(`Siswa "${payload.student}" (${payload.kelas}) tidak sedang punya checkpoint Exam Report yang pending.`);
  }

  const teacherEmail = getTeacherEmail_(ss, payload.teacher);
  if (teacherEmail) {
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    CalendarApp.getDefaultCalendar().createEvent(
      `📌 Reminder: Buat Exam Report — ${payload.student}`,
      start, end,
      {
        description: `Siswa ${payload.student} (${payload.kelas}, ${courseVal}) sudah mencapai checkpoint Lesson ${checkpoint}. Tolong buatkan Exam Report-nya.`,
        guests: teacherEmail,
        sendInvites: true,
      }
    );
  }

  notifyTeacherExamDue_(payload.teacher, payload.student, payload.kelas, courseVal, checkpoint);

  return { success: true, checkpoint, calendarCreated: !!teacherEmail };
}

function getTeacherEmail_(ss, teacher) {
  const rows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();
  const header = rows[0];
  const emailCol = findColumnIndex_(header, 'Email');
  if (emailCol === -1) return null;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(teacher).toLowerCase()) {
      return rows[i][emailCol] || null;
    }
  }
  return null;
}

// ------------------------------------------------------------
// PENDING EXAMS
// ------------------------------------------------------------
function getPendingExamsForTeacher(teacher) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  const jadwalRows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  const myClasses = new Set();
  for (let i = 1; i < jadwalRows.length; i++) {
    if (String(jadwalRows[i][0]).toLowerCase() === String(teacher).toLowerCase()) {
      myClasses.add(jadwalRows[i][2]);
    }
  }

  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  const pending = [];
  for (let i = 1; i < rows.length; i++) {
    const kelas = rows[i][1], student = rows[i][2], course = rows[i][3];
    if (!myClasses.has(kelas)) continue;
    const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
    if (checkpoint) pending.push({ kelas, student, course, lesson: checkpoint });
  }
  return { success: true, pending };
}

function findHariForStudent_(ss, kelas, student) {
  const rows = ss.getSheetByName(TABS.STUDENT).getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) return rows[i][0];
  }
  return null;
}

function validatePayload_(payload, requiredFields) {
  if (!payload) throw new Error('Payload kosong.');
  const missing = requiredFields.filter(f => !payload[f] && payload[f] !== 0);
  if (missing.length > 0) {
    throw new Error(`Field wajib belum diisi: ${missing.join(', ')}`);
  }
}

// ------------------------------------------------------------
// HELPER: update Course/Lesson/Criteria/Status Lesson di tab Student
// ------------------------------------------------------------
function updateStudentRow_(ss, hari, kelas, student, course, lesson, criteria, status) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === hari && rows[i][1] === kelas && rows[i][2] === student) {
      sheet.getRange(i + 1, 4).setValue(course);
      sheet.getRange(i + 1, 5).setValue(lesson);
      if (colIndex.criteria !== -1 && criteria) {
        sheet.getRange(i + 1, colIndex.criteria + 1).setValue(criteria);
      }
      if (colIndex.statusLesson !== -1 && status) {
        sheet.getRange(i + 1, colIndex.statusLesson + 1).setValue(mapStatusLabel_(status));
      }
      return;
    }
  }
}

function mapStatusLabel_(status) {
  if (status === 'done' || status === 'double') return 'Completed';
  if (status === 'in_progress' || status === 'one_and_half') return 'On Going';
  return status || '';
}

// ------------------------------------------------------------
// Ambil data TERAKHIR (criteria, course, lesson) untuk 1 siswa
// ------------------------------------------------------------
function getStudentLatestInfo(kelas, student) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) {
      return {
        success: true,
        course: rows[i][3] || '',
        lesson: rows[i][4] || '',
        criteria: colIndex.criteria !== -1 ? (rows[i][colIndex.criteria] || '') : '',
      };
    }
  }
  return { success: false, error: `Siswa "${student}" (${kelas}) tidak ditemukan di tab Student.` };
}

// ------------------------------------------------------------
// HELPER: update 1 baris di tab Log_Laporan (kolom Daily/Exam)
// ------------------------------------------------------------
function updateLogRow_(ss, payload, columnName, noteText) {
  const sheet = ss.getSheetByName(TABS.LOG);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = findColumnIndex_(header, columnName);

  if (colIndex === -1) {
    throw new Error(`Kolom "${columnName}" tidak ditemukan di header tab Log_Laporan. Header saat ini: ${header.join(', ')}`);
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === payload.hari && rows[i][2] === payload.kelas && rows[i][3] === payload.student) {
      sheet.getRange(i + 1, 5).setValue(payload.course);
      sheet.getRange(i + 1, 6).setValue(payload.lesson);
      sheet.getRange(i + 1, colIndex + 1).setValue(noteText);
      const criteriaCol = findColumnIndex_(header, 'Criteria');
      if (criteriaCol !== -1 && payload.criteria) {
        sheet.getRange(i + 1, criteriaCol + 1).setValue(payload.criteria);
      }
      return;
    }
  }
  throw new Error(`Baris untuk siswa "${payload.student}" (${payload.kelas}, ${payload.hari}) tidak ditemukan di tab Log_Laporan.`);
}

function findColumnIndex_(header, targetName) {
  const normalizedTarget = String(targetName).replace(/\s+/g, ' ').trim().toLowerCase();
  for (let i = 0; i < header.length; i++) {
    const normalizedHeader = String(header[i] || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalizedHeader === normalizedTarget) return i;
  }
  return -1;
}

// ------------------------------------------------------------
// CHECKPOINT TRACKING (tab Student)
// ------------------------------------------------------------
function buildStudentColumnIndex_(header) {
  const idx = {
    selesai: findColumnIndex_(header, 'Selesai'),
    statusLesson: findColumnIndex_(header, 'Status Lesson'),
    criteria: findColumnIndex_(header, 'Criteria'),
  };
  CHECKPOINTS.forEach(cp => {
    idx['lesson' + cp] = findColumnIndex_(header, 'Lesson ' + cp);
    idx['report' + cp] = findColumnIndex_(header, 'Report ' + cp);
    idx['reminder' + cp] = findColumnIndex_(header, 'Last Reminder ' + cp);
  });
  return idx;
}

function isTrue_(v) {
  return v === true || String(v).toUpperCase() === 'TRUE';
}

function computePendingCheckpoint_(row, colIndex) {
  if (colIndex.selesai !== -1 && isTrue_(row[colIndex.selesai])) return null;
  for (let i = 0; i < CHECKPOINTS.length; i++) {
    const cp = CHECKPOINTS[i];
    const lessonCol = colIndex['lesson' + cp];
    const reportCol = colIndex['report' + cp];
    if (lessonCol === -1 || reportCol === -1) continue;
    const lessonVal = row[lessonCol];
    const reportVal = row[reportCol];
    if (lessonVal && !isTrue_(reportVal)) return cp;
  }
  return null;
}

function markLessonCheckpoint_(ss, kelas, student, lessonNum) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) {
      if (colIndex.selesai !== -1 && isTrue_(rows[i][colIndex.selesai])) {
        return { justMarked: false, reason: 'course sudah ditandai Selesai' };
      }
      const lessonCol = colIndex['lesson' + lessonNum];
      if (lessonCol === -1) return { justMarked: false, reason: `kolom "Lesson ${lessonNum}" tidak ditemukan di tab Student` };
      if (rows[i][lessonCol]) return { justMarked: false, reason: 'checkpoint ini sudah pernah ditandai sebelumnya' };

      sheet.getRange(i + 1, lessonCol + 1).setValue(new Date());
      return { justMarked: true, checkpoint: lessonNum };
    }
  }
  return { justMarked: false, reason: 'siswa tidak ditemukan di tab Student' };
}

function markReportDone_(ss, kelas, student) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) {
      const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
      if (!checkpoint) {
        throw new Error(`Tidak ada checkpoint Exam Report yang pending untuk siswa "${student}" (${kelas}).`);
      }
      const reportCol = colIndex['report' + checkpoint];
      if (reportCol === -1) {
        throw new Error(`Kolom "Report ${checkpoint}" tidak ditemukan di tab Student.`);
      }
      sheet.getRange(i + 1, reportCol + 1).setValue(true);
      return { checkpoint };
    }
  }
  throw new Error(`Siswa "${student}" (${kelas}) tidak ditemukan di tab Student.`);
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

function notifyTeacherExamDue_(teacher, student, kelas, course, checkpoint) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const rows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(teacher).toLowerCase()) {
      const chatId = rows[i][2];
      if (chatId) {
        sendTelegramMessage_(
          chatId,
          `📌 <b>Pengingat Exam Report</b>\n${student} (${kelas}) sudah menyelesaikan Lesson ${checkpoint} di ${course}.\nTolong buatkan Exam Report-nya ya!`
        );
      }
      return;
    }
  }
}

// ------------------------------------------------------------
// CRON — Time-driven Trigger, jalankan 1-2x/hari.
// ------------------------------------------------------------
function cronReminderKelipatan8() {
  const config = getConfig_();
  const ss = SpreadsheetApp.openById(config.mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const colIndex = buildStudentColumnIndex_(header);
  const now = new Date();
  const belumDibuatList = [];

  for (let i = 1; i < rows.length; i++) {
    const kelas = rows[i][1], student = rows[i][2], course = rows[i][3];
    const checkpoint = computePendingCheckpoint_(rows[i], colIndex);
    if (!checkpoint) continue;

    const lessonCol = colIndex['lesson' + checkpoint];
    const reminderCol = colIndex['reminder' + checkpoint];
    const lessonDate = rows[i][lessonCol];
    const lastReminded = reminderCol !== -1 ? rows[i][reminderCol] : null;

    const daysPending = lessonDate ? (now - new Date(lessonDate)) / 86400000 : 0;
    const daysSinceReminder = lastReminded ? (now - new Date(lastReminded)) / 86400000 : Infinity;
    const escalated = daysPending >= 7;

    belumDibuatList.push(`- ${student} (${kelas}, ${course}, Lesson ${checkpoint})${escalated ? ' ⚠️ SUDAH ' + Math.floor(daysPending) + ' HARI' : ''}`);

    const threshold = escalated ? 0.4 : 1;
    if (daysSinceReminder >= threshold) {
      const teacherInfo = findTeacherForClass_(ss, kelas);
      if (teacherInfo && teacherInfo.chatId) {
        const msg = escalated
          ? `🚨 <b>URGENT — Sudah ${Math.floor(daysPending)} hari!</b>\n${student} (${kelas}) di ${course} BELUM dibuatkan Exam Report untuk Lesson ${checkpoint}. Mohon segera diselesaikan.`
          : `⏰ <b>Reminder Exam Report</b>\n${student} (${kelas}) di ${course} masih menunggu Exam Report Lesson ${checkpoint} kamu.`;
        sendTelegramMessage_(teacherInfo.chatId, msg);
      }
      if (escalated && config.adminChatId) {
        sendTelegramMessage_(
          config.adminChatId,
          `🚨 <b>Eskalasi (>7 hari)</b>: ${student} (${kelas}, guru: ${teacherInfo ? teacherInfo.name : '?'}) — Lesson ${checkpoint}, ${course}, sudah ${Math.floor(daysPending)} hari belum di-Exam Report.`
        );
      }
      if (reminderCol !== -1) sheet.getRange(i + 1, reminderCol + 1).setValue(now);
    }
  }

  if (belumDibuatList.length > 0 && config.adminChatId) {
    sendTelegramMessage_(config.adminChatId, `📋 <b>Rekap Semua Siswa Belum Exam Report</b>\n${belumDibuatList.join('\n')}`);
  }
}

function findTeacherForClass_(ss, kelas) {
  const jadwalRows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  let teacherName = null;
  for (let i = 1; i < jadwalRows.length; i++) {
    if (jadwalRows[i][2] === kelas) { teacherName = jadwalRows[i][0]; break; }
  }
  if (!teacherName) return null;

  const teacherRows = ss.getSheetByName(TABS.TEACHER).getDataRange().getValues();
  for (let i = 1; i < teacherRows.length; i++) {
    if (String(teacherRows[i][0]).toLowerCase() === String(teacherName).toLowerCase()) {
      return { name: teacherName, chatId: teacherRows[i][2] };
    }
  }
  return null;
}
