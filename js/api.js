// ============================================================
// API WRAPPER — komunikasi ke Google Apps Script Web App
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

// Nama "apiPost" dipertahankan untuk kompatibilitas kode lama, tapi
// implementasinya GET (lihat riwayat: GAS Web App bisa kehilangan body
// POST akibat redirect internal). Semua field payload jadi query string.
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
function apiGetStudentInfo(kelas, namaLengkap) {
  return apiGet('getStudentInfo', { kelas, namaLengkap });
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
function apiMarkAbsent(payload) {
  return apiPost('markAbsent', payload);
}

// ---- Exam Template ----
function apiGetExamTemplate(criteria, course, lesson, namaPanggilan, grades) {
  return apiGet('getExamTemplate', {
    criteria, course, lesson, namaPanggilan,
    gradeLiteracy: grades.literacy || 'B',
    gradeApplication: grades.application || 'B',
    gradeCharacter: grades.character || 'B',
  });
}

// ---- AI Exam Text ----
function apiGetAIExamText(course, lesson, namaPanggilan, grades, objectives) {
  return apiGet('getAIExamText', {
    course, lesson, namaPanggilan,
    gradeLiteracy: grades.literacy || 'B',
    gradeApplication: grades.application || 'B',
    gradeCharacter: grades.character || 'B',
    objectives: JSON.stringify(objectives),
  });
}

// ---- Kelola Murid ----
function apiGetClassesForTeacher(teacher) {
  return apiGet('getClassesForTeacher', { teacher });
}
function apiAddStudent(payload) {
  return apiPost('addStudent', payload);
}
function apiRemoveStudent(payload) {
  return apiPost('removeStudent', payload);
}
function apiRemoveClass(payload) {
  return apiPost('removeClass', payload);
}
