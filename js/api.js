// ============================================================
// API WRAPPER — komunikasi ke Google Apps Script Web App
// ============================================================
// PENTING: ganti GAS_URL di bawah ini dengan URL hasil deploy
// Web App Anda (Deploy > New deployment > Web app > copy URL).
// Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
// ============================================================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwa7uHP17q4MgOhK6oYjo-9tzf3dypyB00WWVjNtiJjT2NwtOkzq7car0ybLdkk6bhPuQ/exec';

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

// PENTING: fungsi ini bernama "apiPost" untuk kompatibilitas kode lama,
// TAPI implementasinya sekarang mengirim via GET (query string), bukan
// benar-benar HTTP POST. Alasan: Google Apps Script Web App melakukan
// redirect internal (.../exec -> script.googleusercontent.com), dan pada
// beberapa kondisi browser mengikuti redirect itu dengan mengubah method
// POST jadi GET SEKALIGUS MEMBUANG body-nya — request sampai ke server
// tapi tanpa data (makanya action-nya kebaca "undefined" di backend).
// GET tidak punya masalah ini sama sekali karena tidak ada body yang bisa
// hilang. Semua field di payload diserialisasi jadi query parameter.
async function apiPost(action, payload = {}) {
  return apiGet(action, payload);
}

// ---- Auth ----
function apiLogin(pin) {
  return apiGet('login', { pin });
}

// ---- Jadwal ----
function apiGetJadwal(teacher, hari) {
  return apiGet('getJadwal', { teacher, hari });
}
function apiGetStudentInfo(kelas, student) {
  return apiGet('getStudentInfo', { kelas, student });
}

// ---- Submit Laporan ----
function apiSubmitDaily(payload) {
  return apiPost('submitDailyReport', payload);
}
function apiSubmitExam(payload) {
  return apiPost('submitExamReport', payload);
}
function apiMarkReportDone(payload) {
  return apiPost('markReportDone', payload);
}
function apiRequestReminder(payload) {
  return apiPost('requestReminder', payload);
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

// ---- AI Exam Text (Gemini, dengan fallback ke VARIASI manual kalau gagal) ----
function apiGetAIExamText(course, lesson, student, grades, objectives) {
  return apiGet('getAIExamText', {
    course, lesson, student,
    gradeLiteracy: grades.literacy || 'B',
    gradeApplication: grades.application || 'B',
    gradeCharacter: grades.character || 'B',
    objectives: JSON.stringify(objectives),
  });
}
