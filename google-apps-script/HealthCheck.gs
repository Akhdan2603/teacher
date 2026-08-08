/**
 * ============================================================
 * HEALTH CHECK — validasi setup sebelum dipakai
 * ============================================================
 * Tujuan: kalau ada Script Property kosong, tab hilang, atau kolom
 * ketinggalan, ketahuan LEBIH AWAL lewat 1 tombol di UI — bukan baru
 * kelihatan saat guru pakai fitur dan dapat error samar-samar seperti
 * "Kolom X tidak ditemukan" atau "Siswa tidak ditemukan".
 *
 * Dipanggil dari frontend via action=healthCheck (doGet, read-only,
 * tidak mengubah data apa pun).
 * ============================================================
 */
function runHealthCheck() {
  const checks = [];
  const addCheck = (name, status, message) => checks.push({ name, status, message });

  // 1. Script Properties
  const props = PropertiesService.getScriptProperties();
  const requiredProps = ['TELEGRAM_TOKEN', 'MAIN_SHEET_ID', 'JUNIOR_SHEET_ID', 'KIDS_SHEET_ID', 'TEENS_SHEET_ID', 'ADMIN_CHAT_ID'];
  const optionalProps = ['GEMINI_API_KEY'];

  requiredProps.forEach(key => {
    const val = props.getProperty(key);
    addCheck(`Script Property: ${key}`, val ? 'ok' : 'error', val ? 'Terisi' : 'KOSONG — wajib diisi di Project Settings > Script Properties');
  });
  optionalProps.forEach(key => {
    const val = props.getProperty(key);
    addCheck(`Script Property: ${key}`, val ? 'ok' : 'warning', val ? 'Terisi' : 'Kosong — fitur AI Generate tidak akan bisa dipakai sampai ini diisi');
  });

  const mainSheetId = props.getProperty('MAIN_SHEET_ID');
  if (!mainSheetId) {
    addCheck('Spreadsheet utama', 'error', 'MAIN_SHEET_ID kosong, sisa pengecekan di-skip.');
    return { success: true, checks };
  }

  // 2. Bisa buka spreadsheet utama?
  let ss;
  try {
    ss = SpreadsheetApp.openById(mainSheetId);
    addCheck('Akses Spreadsheet utama', 'ok', `Berhasil dibuka: "${ss.getName()}"`);
  } catch (err) {
    addCheck('Akses Spreadsheet utama', 'error', 'Gagal dibuka — cek MAIN_SHEET_ID benar dan akun yang deploy script punya akses.');
    return { success: true, checks };
  }

  // 3. Tab wajib: Teacher, Student, Log_Laporan
  checkTabExists_(ss, TABS.TEACHER, checks);
  const studentOk = checkTabExists_(ss, TABS.STUDENT, checks);
  checkTabExists_(ss, TABS.LOG, checks);

  // 4. Kolom tab Teacher
  const teacherSheet = ss.getSheetByName(TABS.TEACHER);
  if (teacherSheet) {
    const header = teacherSheet.getRange(1, 1, 1, teacherSheet.getLastColumn()).getValues()[0];
    ['Name', 'PIN', 'Chat ID tele', 'status'].forEach(col => {
      checkColumnExists_(header, col, `Tab ${TABS.TEACHER}`, checks, 'error');
    });
    checkColumnExists_(header, 'Email', `Tab ${TABS.TEACHER}`, checks, 'warning', 'Tanpa ini, fitur "Ingatkan Report" (Calendar invite) tidak akan jalan — Telegram tetap jalan.');
  }

  // 5. Kolom tab Student (lengkap termasuk semua checkpoint)
  if (studentOk) {
    const studentSheet = ss.getSheetByName(TABS.STUDENT);
    const header = studentSheet.getRange(1, 1, 1, studentSheet.getLastColumn()).getValues()[0];
    STUDENT_BASE_HEADERS.forEach(col => checkColumnExists_(header, col, `Tab ${TABS.STUDENT}`, checks, 'error'));
    CHECKPOINTS.forEach(cp => {
      checkColumnExists_(header, `Lesson ${cp}`, `Tab ${TABS.STUDENT}`, checks, 'error');
      checkColumnExists_(header, `Report ${cp}`, `Tab ${TABS.STUDENT}`, checks, 'error');
      checkColumnExists_(header, `Last Reminder ${cp}`, `Tab ${TABS.STUDENT}`, checks, 'warning', 'Tanpa ini, reminder otomatis untuk checkpoint ini tidak akan terjadwal dengan benar.');
    });
  }

  // 6. Kolom tab Log_Laporan
  const logSheet = ss.getSheetByName(TABS.LOG);
  if (logSheet) {
    const header = logSheet.getRange(1, 1, 1, logSheet.getLastColumn()).getValues()[0];
    ['Hari', 'Kelas', 'Teacher', 'Course', 'Lesson sekarang', 'Daily', 'Exam'].forEach(col => {
      checkColumnExists_(header, col, `Tab ${TABS.LOG}`, checks, 'error');
    });
    const hasNamaLengkap = findColumnIndex_(header, 'Nama Lengkap') !== -1 || findColumnIndex_(header, 'Student') !== -1;
    addCheck(`Tab ${TABS.LOG}: kolom Nama Lengkap/Student`, hasNamaLengkap ? 'ok' : 'error', hasNamaLengkap ? 'Ada' : 'TIDAK ADA — wajib salah satu (Nama Lengkap atau Student)');
  }

  // 7. Tab hari (Senin-Sabtu)
  HARI_LIST.forEach(hari => {
    const sheet = ss.getSheetByName(hari);
    if (!sheet) {
      addCheck(`Tab hari: ${hari}`, 'warning', 'Belum dibuat — akan auto-dibuat begitu ada murid pertama ditambahkan di hari ini, tapi kalau memang sudah harus ada murid, cek lagi.');
      return;
    }
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missing = JADWAL_HEADERS.filter(col => findColumnIndex_(header, col) === -1);
    addCheck(`Tab hari: ${hari}`, missing.length === 0 ? 'ok' : 'error', missing.length === 0 ? 'Header lengkap' : `Kolom hilang: ${missing.join(', ')}`);
  });

  // 8. Spreadsheet Exam Template (Junior/Kids/Teens) bisa dibuka?
  const config = getConfig_();
  Object.keys(config.examSheetIds).forEach(criteria => {
    const id = config.examSheetIds[criteria];
    if (!id) return; // sudah ditandai error di Script Properties check
    try {
      const examSs = SpreadsheetApp.openById(id);
      addCheck(`Spreadsheet Exam Template: ${criteria}`, 'ok', `Berhasil dibuka: "${examSs.getName()}"`);
    } catch (err) {
      addCheck(`Spreadsheet Exam Template: ${criteria}`, 'error', 'Gagal dibuka — cek ID benar dan akses.');
    }
  });

  // 9. Telegram token valid? (panggil getMe, ringan & tidak mengirim apa pun)
  if (config.telegramToken) {
    try {
      const res = UrlFetchApp.fetch(`https://api.telegram.org/bot${config.telegramToken}/getMe`, { muteHttpExceptions: true });
      const data = JSON.parse(res.getContentText());
      addCheck('Telegram Bot Token', data.ok ? 'ok' : 'error', data.ok ? `Valid, bot: @${data.result.username}` : 'Token tidak valid (Telegram menolak).');
    } catch (err) {
      addCheck('Telegram Bot Token', 'error', 'Gagal menghubungi Telegram API: ' + err.message);
    }
  }

  // 10. Time-driven trigger untuk cron reminder terpasang?
  const triggers = ScriptApp.getProjectTriggers();
  const hasCronTrigger = triggers.some(t => t.getHandlerFunction() === 'cronReminderKelipatan8');
  addCheck('Trigger reminder harian', hasCronTrigger ? 'ok' : 'warning', hasCronTrigger ? `${triggers.filter(t => t.getHandlerFunction() === 'cronReminderKelipatan8').length} trigger terpasang` : 'Belum ada trigger untuk cronReminderKelipatan8 — reminder otomatis tidak akan pernah jalan.');

  return { success: true, checks };
}

function checkTabExists_(ss, name, checks) {
  const exists = !!ss.getSheetByName(name);
  checks.push({ name: `Tab: ${name}`, status: exists ? 'ok' : 'error', message: exists ? 'Ada' : 'TIDAK DITEMUKAN — wajib ada' });
  return exists;
}

function checkColumnExists_(header, colName, context, checks, severityIfMissing, extraNote) {
  const exists = findColumnIndex_(header, colName) !== -1;
  checks.push({
    name: `${context}: kolom "${colName}"`,
    status: exists ? 'ok' : severityIfMissing,
    message: exists ? 'Ada' : `TIDAK ADA${extraNote ? ' — ' + extraNote : ''}`,
  });
}
