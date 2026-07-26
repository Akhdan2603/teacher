// ============================================================
// API WRAPPER — komunikasi ke Google Apps Script Web App
// ============================================================
// PENTING: ganti GAS_URL di bawah ini dengan URL hasil deploy
// Web App Anda (Deploy > New deployment > Web app > copy URL).
// Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
// ============================================================
const GAS_URL = 'PASTE_URL_WEB_APP_ANDA_DI_SINI';

async function apiGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();
  try {
    const res = await fetch(`${GAS_URL}?${query}`);
    return await res.json();
  } catch (err) {
    console.error('API GET error:', err);
    return { success: false, error: 'Tidak bisa terhubung ke server. Cek koneksi internet.' };
  }
}

async function apiPost(action, payload = {}) {
  try {
    // PENTING: sengaja TIDAK set header 'Content-Type: application/json'.
    // Google Apps Script Web App tidak menangani CORS preflight (OPTIONS)
    // dengan baik. Body string tanpa Content-Type eksplisit dikirim browser
    // sebagai 'text/plain', yang dianggap "simple request" sehingga TIDAK
    // memicu preflight — request langsung berhasil. Jangan diubah ke
    // application/json kecuali sudah menambahkan doOptions() di Code.gs.
    const res = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    });
    return await res.json();
  } catch (err) {
    console.error('API POST error:', err);
    return { success: false, error: 'Tidak bisa terhubung ke server. Cek koneksi internet.' };
  }
}

// ---- Auth ----
function apiLogin(name, pin) {
  return apiGet('login', { name, pin });
}
function apiGetTeachers() {
  return apiGet('getTeachers');
}

// ---- Jadwal ----
function apiGetJadwal(teacher, hari) {
  return apiGet('getJadwal', { teacher, hari });
}

// ---- Submit Laporan ----
function apiSubmitDaily(payload) {
  return apiPost('submitDailyReport', payload);
}
function apiSubmitExam(payload) {
  return apiPost('submitExamReport', payload);
}

// ---- Exam Template ----
function apiGetExamTemplate(criteria, course, lesson, student, grades) {
  return apiGet('getExamTemplate', {
    criteria, course, lesson, student,
    gradeLiteracy: grades.literacy || 'B',
    gradeApplication: grades.application || 'B',
    gradeCharacter: grades.character || 'B',
  });
}
