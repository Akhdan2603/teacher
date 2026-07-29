/**
 * ============================================================
 * TIMEDOOR REPORT GENERATOR — BACKEND (Google Apps Script)
 * ============================================================
 * Ini adalah SATU-SATUNYA backend project ini. Tidak ada server
 * lain, tidak ada biaya. Deploy sebagai Web App (Execute as: Me,
 * Who has access: Anyone), lalu pakai URL-nya di frontend.
 *
 * SETUP WAJIB (sebelum deploy):
 * 1. Buka Project Settings (ikon gear) → Script Properties → tambahkan:
 *      TELEGRAM_TOKEN     = token bot dari BotFather
 *      MAIN_SHEET_ID      = ID spreadsheet "Input data" (Teacher/Jadwal/Student/Log_Laporan/Sheet5)
 *      JUNIOR_SHEET_ID    = ID spreadsheet "JUNIORS report templates"
 *      KIDS_SHEET_ID      = ID spreadsheet "KIDS report templates"
 *      TEENS_SHEET_ID     = ID spreadsheet "TEENS report templates"
 *      ADMIN_CHAT_ID      = Chat ID Telegram admin (isi manual setelah admin /start ke bot)
 *
 *    JANGAN hardcode token/ID langsung di kode ini. Kenapa: kalau repo
 *    ini pernah jadi public GitHub, token akan bocor & bot bisa dibajak
 *    orang lain. Script Properties aman karena tidak ikut ke source code.
 *
 * 2. Deploy > New deployment > Web app > Execute as "Me", Access "Anyone".
 *    Copy URL-nya, taruh di js/api.js sebagai GAS_URL.
 *
 * 3. Buat Time-driven Trigger (Triggers > Add Trigger) untuk fungsi
 *    `cronReminderKelipatan8` — jalankan misalnya tiap hari jam 08:00.
 *    Ini gratis dan tidak butuh Vercel Cron sama sekali.
 * ============================================================
 */

// ------------------------------------------------------------
// KONFIGURASI (diambil dari Script Properties, bukan hardcode)
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

// Nama tab persis sesuai spreadsheet Anda — jangan diubah tanpa
// mengubah juga nama tab aslinya di Google Sheets.
const TABS = {
  TEACHER: 'Teacher',
  JADWAL: 'Jadwal',
  STUDENT: 'Student',
  LOG: 'Log_Laporan',
  TRIGGER: 'Sheet5',
};

// ------------------------------------------------------------
// ENTRY POINTS (dipanggil dari frontend via fetch())
// ------------------------------------------------------------

/**
 * doGet menangani semua pembacaan data (read-only), pakai query
 * string ?action=... supaya bisa dipanggil langsung dari browser
 * tanpa preflight CORS yang ribet.
 */
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

/**
 * doPost menangani semua penulisan data (submit laporan).
 * Body harus JSON: { action: '...', payload: {...} }
 */
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
// AUTH (PIN check — bukan keamanan tingkat tinggi, cuma gerbang
// identitas ringan sesuai kebutuhan project ini)
// ------------------------------------------------------------
function handleLogin(pin) {
  const sheet = SpreadsheetApp.openById(getConfig_().mainSheetId).getSheetByName(TABS.TEACHER);
  const rows = sheet.getDataRange().getValues(); // [Name, PIN, Chat ID tele, status]
  const trimmedPin = String(pin).trim();

  if (!trimmedPin) return { success: false, error: 'PIN kosong.' };

  const matches = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowPin = String(row[1]).trim();
    const isActive = String(row[3]).toUpperCase() === 'TRUE';
    if (isActive && rowPin === trimmedPin) matches.push(String(row[0]).trim());
  }

  if (matches.length === 0) {
    return { success: false, error: 'PIN tidak ditemukan.' };
  }
  if (matches.length > 1) {
    // Safety-net: PIN dipakai lebih dari 1 guru aktif. Sistem tidak bisa
    // menebak yang mana, jadi diminta hubungi admin untuk perbaiki data
    // (PIN wajib unik antar guru sejak login jadi PIN-only, tanpa nama).
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
// PENDING EXAMS — daftar siswa kelipatan-8 milik guru tertentu yang
// statusnya masih "Belum Dibuat" di Sheet5 (Trigger). Dipakai nanti
// di tab Exam Report untuk menampilkan "siswa mana yang perlu di-exam".
// ------------------------------------------------------------
function getPendingExamsForTeacher(teacher) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  // kumpulkan semua nama kelas yang diampu guru ini (dari tab Jadwal)
  const jadwalRows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  const myClasses = new Set();
  for (let i = 1; i < jadwalRows.length; i++) {
    if (String(jadwalRows[i][0]).toLowerCase() === String(teacher).toLowerCase()) {
      myClasses.add(jadwalRows[i][2]);
    }
  }

  const triggerRows = ss.getSheetByName(TABS.TRIGGER).getDataRange().getValues();
  const pending = [];
  for (let i = 1; i < triggerRows.length; i++) {
    const [kelas, student, course, lesson, status] = triggerRows[i];
    if (status === 'Belum Dibuat' && myClasses.has(kelas)) {
      pending.push({ kelas, student, course, lesson });
    }
  }

  return { success: true, pending };
}

// ------------------------------------------------------------
// JADWAL — gabungkan tab Jadwal (Teacher,Hari,Kelas,Student)
// dengan tab Student (Hari,Kelas,Student,Course,Lesson sekarang)
// supaya frontend dapat 1 payload lengkap per murid.
// ------------------------------------------------------------
function getJadwalForTeacher(teacher, hari) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const jadwalRows = ss.getSheetByName(TABS.JADWAL).getDataRange().getValues();
  const studentRows = ss.getSheetByName(TABS.STUDENT).getDataRange().getValues();

  // index tab Student by "Hari|Kelas|Student" untuk lookup cepat
  const studentIndex = {};
  for (let i = 1; i < studentRows.length; i++) {
    const [sHari, sKelas, sStudent, sCourse, sLesson] = studentRows[i];
    studentIndex[`${sHari}|${sKelas}|${sStudent}`] = { course: sCourse, lesson: sLesson };
  }

  const classMap = {}; // { "T14B": [ {nama, course, lesson}, ... ] }
  for (let i = 1; i < jadwalRows.length; i++) {
    const [rTeacher, rHari, rKelas, rStudent] = jadwalRows[i];
    if (String(rTeacher).trim().toLowerCase() !== String(teacher).trim().toLowerCase()) continue;
    if (String(rHari).trim().toLowerCase() !== String(hari).trim().toLowerCase()) continue;

    if (!classMap[rKelas]) classMap[rKelas] = [];
    const extra = studentIndex[`${rHari}|${rKelas}|${rStudent}`] || {};
    classMap[rKelas].push({
      nama: rStudent,
      course: extra.course || '',
      lesson: extra.lesson || '',
    });
  }

  return { success: true, kelas: classMap };
}

// ------------------------------------------------------------
// SUBMIT DAILY REPORT
// payload: { teacher, hari, kelas, student, criteria, course, lesson, noteText }
// ------------------------------------------------------------
function submitDailyReport(payload) {
  validatePayload_(payload, ['teacher', 'hari', 'kelas', 'student', 'course', 'lesson']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  // 1. Update tab Student: isi Course, Lesson sekarang, & Criteria (state terbaru murid ini)
  updateStudentRow_(ss, payload.hari, payload.kelas, payload.student, payload.course, payload.lesson, payload.criteria);

  // 2. Update tab Log_Laporan: tulis noteText ke kolom "Daily" (in-place, bukan append)
  updateLogRow_(ss, payload, 'Daily', payload.noteText || '');

  // 3. Cek kelipatan 8 → update Sheet5 + kirim reminder Telegram ke guru
  const lessonNum = parseInt(payload.lesson, 10);
  if (!isNaN(lessonNum) && lessonNum > 0 && lessonNum % 8 === 0) {
    markExamTrigger_(ss, payload);
    notifyTeacherExamDue_(payload);
  }

  return { success: true };
}

// ------------------------------------------------------------
// SUBMIT EXAM REPORT
// payload: { teacher, hari, kelas, student, criteria, course, noteText }
// ------------------------------------------------------------
function submitExamReport(payload) {
  validatePayload_(payload, ['teacher', 'kelas', 'student', 'course']);
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);

  // Exam Report tidak menanyakan "hari" ke guru (tidak relevan secara UX di
  // tab ini) — tapi baris di Log_Laporan diindeks berdasarkan Hari+Kelas+Student.
  // Jadi kita resolve hari-nya otomatis dari tab Student, bukan menebak di frontend.
  const hari = findHariForStudent_(ss, payload.kelas, payload.student);
  if (!hari) {
    throw new Error(`Tidak bisa menentukan hari untuk siswa "${payload.student}" di kelas "${payload.kelas}". Pastikan siswa ini terdaftar di tab Student.`);
  }
  const fullPayload = Object.assign({}, payload, { hari });

  updateLogRow_(ss, fullPayload, 'Exam', payload.noteText || '');
  clearExamTrigger_(ss, fullPayload); // tandai "Sudah Dibuat" di Sheet5

  return { success: true };
}

// Cari hari (Senin/Selasa/dst) untuk kombinasi kelas+student tertentu,
// dengan melihat tab Student (Hari,Kelas,Student,Course,Lesson sekarang).
function findHariForStudent_(ss, kelas, student) {
  const rows = ss.getSheetByName(TABS.STUDENT).getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) return rows[i][0];
  }
  return null;
}

// Validasi field wajib ada & tidak kosong sebelum ditulis ke Sheets.
// Dilempar sebagai Error biasa supaya tertangkap oleh try/catch di
// doPost dan dikembalikan sebagai { success:false, error: ... } yang
// jelas ke frontend, bukan gagal diam-diam / menulis data setengah jadi.
function validatePayload_(payload, requiredFields) {
  if (!payload) throw new Error('Payload kosong.');
  const missing = requiredFields.filter(f => !payload[f] && payload[f] !== 0);
  if (missing.length > 0) {
    throw new Error(`Field wajib belum diisi: ${missing.join(', ')}`);
  }
}

// ------------------------------------------------------------
// HELPER: update 1 baris di tab Student berdasarkan Hari+Kelas+Student
// ------------------------------------------------------------
function updateStudentRow_(ss, hari, kelas, student, course, lesson, criteria) {
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const criteriaCol = findColumnIndex_(header, 'Criteria'); // -1 kalau kolomnya belum ditambahkan user

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === hari && rows[i][1] === kelas && rows[i][2] === student) {
      sheet.getRange(i + 1, 4).setValue(course);  // kolom D: Course
      sheet.getRange(i + 1, 5).setValue(lesson);  // kolom E: Lesson sekarang
      if (criteriaCol !== -1 && criteria) {
        sheet.getRange(i + 1, criteriaCol + 1).setValue(criteria);
      }
      return;
    }
  }
}

// ------------------------------------------------------------
// Ambil data TERAKHIR (criteria, course, lesson) yang tersimpan untuk
// 1 siswa di tab Student — dipakai Exam Report supaya guru tidak perlu
// pilih ulang Criteria & Course secara manual (sudah otomatis dari
// submission Daily Report paling akhir untuk siswa ini).
// ------------------------------------------------------------
function getStudentLatestInfo(kelas, student) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const sheet = ss.getSheetByName(TABS.STUDENT);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0];
  const criteriaCol = findColumnIndex_(header, 'Criteria');

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === kelas && rows[i][2] === student) {
      return {
        success: true,
        course: rows[i][3] || '',
        lesson: rows[i][4] || '',
        criteria: criteriaCol !== -1 ? (rows[i][criteriaCol] || '') : '',
      };
    }
  }
  return { success: false, error: `Siswa "${student}" (${kelas}) tidak ditemukan di tab Student.` };
}

// ------------------------------------------------------------
// HELPER: update 1 baris di tab Log_Laporan (kolom Daily/Exam diisi teks)
// ------------------------------------------------------------
function updateLogRow_(ss, payload, columnName, noteText) {
  const sheet = ss.getSheetByName(TABS.LOG);
  const rows = sheet.getDataRange().getValues();
  const header = rows[0]; // Teacher,Hari,Kelas,Student,Course,Lesson sekarang,Daily,Exam
  const colIndex = findColumnIndex_(header, columnName);

  if (colIndex === -1) {
    throw new Error(`Kolom "${columnName}" tidak ditemukan di header tab Log_Laporan. Header saat ini: ${header.join(', ')}`);
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === payload.hari && rows[i][2] === payload.kelas && rows[i][3] === payload.student) {
      sheet.getRange(i + 1, 5).setValue(payload.course);   // Course
      sheet.getRange(i + 1, 6).setValue(payload.lesson);   // Lesson sekarang
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

// Cari index kolom berdasarkan nama header, toleran terhadap spasi
// ekstra/huruf besar-kecil (menghindari bug rapuh kalau header sheet
// aslinya punya spasi tak terlihat, misal "Daily " vs "Daily").
function findColumnIndex_(header, targetName) {
  const normalizedTarget = String(targetName).replace(/\s+/g, ' ').trim().toLowerCase();
  for (let i = 0; i < header.length; i++) {
    const normalizedHeader = String(header[i] || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (normalizedHeader === normalizedTarget) return i;
  }
  return -1;
}

// ------------------------------------------------------------
// HELPER: tandai / hapus trigger kelipatan-8 di Sheet5
// Sheet5 kolom: Kelas, Student, Course, Lesson sekarang, Status, Terakhir Diingatkan
// ------------------------------------------------------------
function markExamTrigger_(ss, payload) {
  const sheet = ss.getSheetByName(TABS.TRIGGER);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === payload.kelas && rows[i][1] === payload.student) {
      sheet.getRange(i + 1, 3).setValue(payload.course);
      sheet.getRange(i + 1, 4).setValue(payload.lesson);
      sheet.getRange(i + 1, 5).setValue('Belum Dibuat');
      sheet.getRange(i + 1, 6).setValue(new Date());
      return;
    }
  }
  // Kalau belum ada baris untuk siswa ini, tambahkan baru
  sheet.appendRow([payload.kelas, payload.student, payload.course, payload.lesson, 'Belum Dibuat', new Date()]);
}

function clearExamTrigger_(ss, payload) {
  const sheet = ss.getSheetByName(TABS.TRIGGER);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === payload.kelas && rows[i][1] === payload.student && rows[i][2] === payload.course) {
      sheet.getRange(i + 1, 5).setValue('Sudah Dibuat');
      return;
    }
  }
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

function notifyTeacherExamDue_(payload) {
  const ss = SpreadsheetApp.openById(getConfig_().mainSheetId);
  const teacherSheet = ss.getSheetByName(TABS.TEACHER);
  const rows = teacherSheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(payload.teacher).toLowerCase()) {
      const chatId = rows[i][2];
      if (chatId) {
        sendTelegramMessage_(
          chatId,
          `📌 <b>Pengingat Exam Report</b>\n${payload.student} (${payload.kelas}) sudah menyelesaikan lesson ${payload.lesson} di ${payload.course}.\nTolong buatkan Exam Report-nya ya!`
        );
      }
      return;
    }
  }
}

// ------------------------------------------------------------
// CRON — dipanggil oleh Time-driven Trigger (bukan Vercel Cron)
// Jalan tiap hari, tapi hanya benar-benar kirim pesan kalau sudah
// >= 2 hari sejak "Terakhir Diingatkan" (spam tiap 2 hari sesuai request).
// ------------------------------------------------------------
function cronReminderKelipatan8() {
  const config = getConfig_();
  const ss = SpreadsheetApp.openById(config.mainSheetId);
  const sheet = ss.getSheetByName(TABS.TRIGGER);
  const rows = sheet.getDataRange().getValues();
  const now = new Date();
  const belumDibuatList = [];

  for (let i = 1; i < rows.length; i++) {
    const [kelas, student, course, lesson, status, lastReminded] = rows[i];
    if (status !== 'Belum Dibuat') continue;

    belumDibuatList.push(`- ${student} (${kelas}, ${course}, Lesson ${lesson})`);

    const daysSince = lastReminded ? (now - new Date(lastReminded)) / (1000 * 60 * 60 * 24) : 999;
    if (daysSince >= 2) {
      const teacher = findTeacherForClass_(ss, kelas);
      if (teacher && teacher.chatId) {
        sendTelegramMessage_(
          teacher.chatId,
          `⏰ <b>Reminder Exam Report</b>\n${student} (${kelas}) di ${course} masih menunggu Exam Report kamu.`
        );
      }
      sheet.getRange(i + 1, 6).setValue(now);
    }
  }

  // Notifikasi admin: daftar lengkap siswa yang masih belum dibuatkan report
  if (belumDibuatList.length > 0 && config.adminChatId) {
    sendTelegramMessage_(
      config.adminChatId,
      `📋 <b>Daftar Siswa Belum Exam Report</b>\n${belumDibuatList.join('\n')}`
    );
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
