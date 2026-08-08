// ============================================================
// EXAM REPORT TAB
// Depends on: data.js (COURSE_MAP), course-tab-map.js, api.js, auth.js, app.js (buildAndSavePDF, toast, escHtml, formatDate)
// ============================================================

let examVariants = { literacy: [], application: [], character: [] };
let examVariantIndex = { literacy: 0, application: 0, character: 0 };
let examPendingList = [];
let examPendingLoaded = false;

// Muat daftar pending HANYA saat guru pertama kali buka tab Exam Report
// (bukan langsung saat halaman load, supaya tidak fetch sebelum login).
const _examTabBtnObserver = document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.tab-bar .tab-btn');
  const examBtn = Array.from(btns).find(b => b.textContent.includes('Exam Report'));
  if (examBtn) {
    examBtn.addEventListener('click', () => {
      if (!examPendingLoaded) { loadPendingExams(); examPendingLoaded = true; }
    });
  }
});

async function loadPendingExams() {
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const select = document.getElementById('exam-pending-select');
  if (!teacher) { select.innerHTML = '<option value="">Sesi login tidak ditemukan</option>'; return; }

  select.innerHTML = '<option value="">Memuat...</option>';
  const res = await apiGet('getPendingExams', { teacher });

  if (!res.success) {
    select.innerHTML = '<option value="">Gagal memuat</option>';
    toast(res.error || 'Gagal memuat daftar pending exam.', 'error');
    return;
  }

  examPendingList = res.pending || [];
  if (examPendingList.length === 0) {
    select.innerHTML = '<option value="">🎉 Tidak ada siswa yang perlu di-exam</option>';
    return;
  }

  select.innerHTML = '<option value="">-- Pilih Siswa --</option>' +
    examPendingList.map((p, i) =>
      `<option value="${i}">${escHtml(p.namaPanggilan || p.namaLengkap)} (${escHtml(p.kelas)}, ${escHtml(p.course)}, Lesson ${p.lesson})</option>`
    ).join('');
}

function onPendingExamSelect() {
  const idx = document.getElementById('exam-pending-select').value;
  if (idx === '') return;
  const p = examPendingList[idx];

  document.getElementById('exam-student').value = p.namaPanggilan || p.namaLengkap;
  document.getElementById('exam-nama-lengkap').value = p.namaLengkap;
  document.getElementById('exam-kelas').value = p.kelas;
  document.getElementById('exam-lesson').value = p.lesson;

  autoFillCriteriaAndCourse(p.kelas, p.namaLengkap);
}

// Ambil Nama Lengkap (kunci pencocokan) — fallback ke field nama biasa
// kalau diisi manual tanpa pilih dari daftar pending.
function getExamNamaLengkap() {
  const hidden = document.getElementById('exam-nama-lengkap').value;
  return hidden || document.getElementById('exam-student').value;
}

// Tarik Criteria & Course otomatis dari data Daily Report TERAKHIR untuk
// siswa ini (tersimpan di tab Student). Tetap bisa di-override manual
// oleh guru setelahnya — ini cuma pre-fill, bukan field terkunci.
async function autoFillCriteriaAndCourse(kelas, namaLengkap) {
  if (!kelas || !namaLengkap) return;

  toast('Mengambil Criteria & Course dari data terakhir...', 'success');
  const res = await apiGetStudentInfo(kelas, namaLengkap);

  if (!res.success) {
    toast(`${res.error || 'Gagal mengambil data siswa.'} Silakan pilih Criteria & Course manual.`, 'error');
    return;
  }

  if (res.criteria && COURSE_MAP[res.criteria]) {
    document.getElementById('exam-criteria').value = res.criteria;
    onExamCriteriaChange(); // isi ulang dropdown Course sesuai Criteria ini

    if (res.course) {
      const courseSelect = document.getElementById('exam-course');
      const matchExists = Array.from(courseSelect.options).some(o => o.value === res.course);
      if (matchExists) {
        courseSelect.value = res.course;
        onExamCourseChange();
        toast(`Criteria & Course otomatis terisi dari data terakhir: ${res.criteria} — ${res.course}`, 'success');
      } else {
        toast(`Course terakhir ("${res.course}") tidak cocok dengan opsi dropdown saat ini — silakan pilih manual.`, 'error');
      }
    }
  } else {
    toast('Belum ada data Criteria tersimpan untuk siswa ini (mungkin belum pernah Daily Report, atau kolom Criteria belum ditambahkan di tab Student) — silakan pilih manual.', 'error');
  }
}

function onExamCriteriaChange() {
  const criteria = document.getElementById('exam-criteria').value;
  const courseSelect = document.getElementById('exam-course');

  if (!criteria || !COURSE_MAP[criteria]) {
    courseSelect.innerHTML = '<option value="">-- Pilih Criteria Dulu --</option>';
    document.getElementById('exam-tab-map-hint').textContent = '';
    return;
  }

  courseSelect.innerHTML = '<option value="">-- Pilih Course --</option>' +
    COURSE_MAP[criteria].map(c => `<option value="${escHtml(c)}">${escHtml(c)}</option>`).join('');
  onExamCourseChange();
}

function onExamCourseChange() {
  const criteria = document.getElementById('exam-criteria').value;
  const course = document.getElementById('exam-course').value;
  const hint = document.getElementById('exam-tab-map-hint');

  if (!criteria || !course) { hint.textContent = ''; return; }

  const tabName = getCourseTabName(criteria, course);
  hint.textContent = tabName
    ? ''
    : '⚠️ Course ini belum ada mapping ke tab spreadsheet (lihat js/course-tab-map.js). Tombol "Ambil Template dari Sistem" tidak akan bekerja untuk course ini — isi manual saja di kotak teks di bawah.';
}

// Ambil materi lesson 1..checkpoint dari data.js (COURSE_DATA) DAN
// templates.js (TEMPLATES) — dua-duanya file lokal, TIDAK ada
// ketergantungan spreadsheet sama sekali di jalur AI ini. TEMPLATES
// dikirim juga supaya AI punya kalimat yang sudah rapi sebagai bahan
// rangkai-ulang, bukan cuma poin-poin objective yang mentah.
function buildObjectivesForAI(course, checkpoint) {
  const lessons = COURSE_DATA[course];
  if (!lessons) return [];
  const templatesForCourse = (typeof TEMPLATES !== 'undefined' && TEMPLATES[course]) || {};

  return lessons
    .filter(l => l.num >= 1 && l.num <= checkpoint)
    .map(l => ({
      lesson: l.num,
      title: l.title,
      objectives: l.objectives,
      // {nama} dilepas jadi generik "siswa" di sini — nama asli murid
      // ditempel ulang oleh AI di backend, bukan dari string ini.
      templateText: (templatesForCourse[String(l.num)] || '').replace(/\{nama\}/g, 'siswa'),
    }));
}

async function fetchAIExamTemplates() {
  const criteria = document.getElementById('exam-criteria').value;
  const course = document.getElementById('exam-course').value;
  const lesson = document.getElementById('exam-lesson').value;
  const namaPanggilan = document.getElementById('exam-student').value;

  if (!course || !lesson || !namaPanggilan) {
    toast('Isi dulu Nama Murid, Lesson, dan Course.', 'error');
    return;
  }

  const objectives = buildObjectivesForAI(course, parseInt(lesson, 10));
  if (objectives.length === 0) {
    toast(`Tidak ada data lesson untuk course "${course}" di data.js — cek COURSE_DATA, atau pakai tombol "Ambil Template dari Sistem" sebagai alternatif.`, 'error');
    return;
  }

  const grades = {
    literacy: document.getElementById('exam-grade-literacy').value,
    application: document.getElementById('exam-grade-application').value,
    character: document.getElementById('exam-grade-character').value,
  };

  toast('Meminta AI generate teks (bisa beberapa detik)...', 'success');
  const res = await apiGetAIExamText(course, lesson, namaPanggilan, grades, objectives);

  if (!res.success) {
    toast(`AI gagal: ${res.error || 'tidak diketahui'}. Coba lagi, atau pakai tombol "Ambil Template dari Sistem" sebagai alternatif manual.`, 'error');
    return; // TIDAK auto-fallback ke spreadsheet — biar guru yang putuskan sendiri
  }

  ['literacy', 'application', 'character'].forEach(cat => {
    examVariants[cat] = res.texts[cat] || [];
    examVariantIndex[cat] = 0;
    document.getElementById(`exam-text-${cat}`).value = examVariants[cat][0] || '';
  });

  updateExamPreview();
  toast('Teks berhasil digenerate AI ✔ — tetap cek & edit sebelum kirim.', 'success');
}

async function fetchExamTemplates() {
  const criteria = document.getElementById('exam-criteria').value;
  const course = document.getElementById('exam-course').value;
  const lesson = document.getElementById('exam-lesson').value;
  const namaPanggilan = document.getElementById('exam-student').value;

  if (!criteria || !course || !lesson || !namaPanggilan) {
    toast('Isi dulu Nama Murid, Lesson, Criteria, dan Course.', 'error');
    return;
  }

  const tabName = getCourseTabName(criteria, course);
  if (!tabName) {
    toast('Course ini belum ada mapping tab spreadsheet — isi manual di kotak teks.', 'error');
    return;
  }

  const grades = {
    literacy: document.getElementById('exam-grade-literacy').value,
    application: document.getElementById('exam-grade-application').value,
    character: document.getElementById('exam-grade-character').value,
  };

  toast('Mengambil template dari sistem...', 'success');
  const res = await apiGetExamTemplate(criteria, tabName, lesson, namaPanggilan, grades);

  if (!res.success) {
    toast(res.error || 'Gagal mengambil template.', 'error');
    return;
  }

  ['literacy', 'application', 'character'].forEach(cat => {
    examVariants[cat] = res.texts[cat] || [];
    examVariantIndex[cat] = 0;
    document.getElementById(`exam-text-${cat}`).value = examVariants[cat][0] || '';
  });

  updateExamPreview();

  const emptyCats = ['literacy', 'application', 'character'].filter(c => examVariants[c].length === 0);
  if (emptyCats.length > 0) {
    toast(`Template dimuat, tapi kategori berikut kosong di spreadsheet: ${emptyCats.join(', ')}. Isi manual untuk kategori itu.`, 'error');
  } else {
    toast('Template berhasil dimuat ✔ — cek & edit dulu sebelum kirim.', 'success');
  }
}

function cycleVariant(category) {
  const variants = examVariants[category];
  if (!variants || variants.length <= 1) {
    toast('Tidak ada varian lain untuk kategori ini.', 'error');
    return;
  }
  examVariantIndex[category] = (examVariantIndex[category] + 1) % variants.length;
  document.getElementById(`exam-text-${category}`).value = variants[examVariantIndex[category]];
  updateExamPreview();
}

function buildExamWAMessage() {
  const student = document.getElementById('exam-student').value || '—';
  const course = document.getElementById('exam-course').value || document.getElementById('exam-kelas').value || '—';
  const lit = document.getElementById('exam-text-literacy').value.trim();
  const app = document.getElementById('exam-text-application').value.trim();
  const char = document.getElementById('exam-text-character').value.trim();

  return `Halo Bapak/Ibu 😊\nBerikut hasil Exam Report ananda *${student}* untuk course *${course}*:\n\n`
    + `📘 *Coding Literacy & Concept*\n${lit || '—'}\n\n`
    + `💻 *Coding Application*\n${app || '—'}\n\n`
    + `🌟 *Character*\n${char || '—'}\n\n`
    + `Terima kasih atas dukungan Bapak/Ibu 🙏`;
}

function updateExamPreview() {
  document.getElementById('exam-wa-bubble').textContent = buildExamWAMessage();
}

async function copyExamWAMessage() {
  const msg = buildExamWAMessage();
  try {
    await navigator.clipboard.writeText(msg);
    toast('Pesan disalin!', 'success');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = msg;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Pesan disalin!', 'success');
  }
}

function openExamWhatsApp() {
  updateExamPreview();
  window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(buildExamWAMessage()), '_blank');
}

async function downloadExamPDF() {
  const student = document.getElementById('exam-student').value || '—';
  const kelas = document.getElementById('exam-kelas').value || '—';
  const tanggalInput = document.getElementById('exam-tanggal').value || new Date().toISOString().slice(0, 10);
  const tanggal = formatDate(tanggalInput);

  const combinedText =
    `Coding Literacy & Concept:\n${document.getElementById('exam-text-literacy').value || '—'}\n\n` +
    `Coding Application:\n${document.getElementById('exam-text-application').value || '—'}\n\n` +
    `Character:\n${document.getElementById('exam-text-character').value || '—'}`;

  // Catatan: Exam Report memakai builder PDF yang sama dengan Daily Report
  // (buildAndSavePDF via downloadReportPDF), demi konsistensi visual &
  // menghindari kode duplikat. photos dikosongkan karena Exam Report tidak
  // melibatkan foto — section foto otomatis disembunyikan total di PDF.
  await downloadReportPDF({
    btnId: 'ebtn-pdf',
    btnDefaultText: '📄 Download PDF',
    kelas, tanggal,
    photos: [],
    students: [{ nama: student, progress: combinedText }],
    labels: {
      title: 'Exam Report',
      labelKelas: 'Class: ',
      labelTanggal: 'Date: ',
      colName: 'NAME',
      colProgress: 'EXAM RESULT',
      photoEmpty: () => 'No Photo',
      fileName: (k) => `ExamReport_${k}_${student.replace(/\s+/g, '_')}`,
    },
  });
}

async function submitExamToSheet() {
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const kelas = document.getElementById('exam-kelas').value;
  const namaPanggilan = document.getElementById('exam-student').value;
  const namaLengkap = getExamNamaLengkap();
  const course = document.getElementById('exam-course').value;

  if (!teacher) { toast('Sesi login tidak ditemukan, silakan login ulang.', 'error'); return; }
  if (!kelas || !namaLengkap || !course) {
    toast('Lengkapi dulu Kelas, Nama Murid, dan Course sebelum menyimpan.', 'error');
    return;
  }

  const combinedText =
    `Coding Literacy & Concept: ${document.getElementById('exam-text-literacy').value || '—'}\n` +
    `Coding Application: ${document.getElementById('exam-text-application').value || '—'}\n` +
    `Character: ${document.getElementById('exam-text-character').value || '—'}`;

  const btn = document.getElementById('ebtn-save');
  btn.disabled = true; btn.textContent = 'Menyimpan...';

  const res = await apiSubmitExam({ teacher, kelas, namaLengkap, namaPanggilan, course, noteText: combinedText });

  btn.disabled = false; btn.textContent = '💾 Simpan ke Sistem';

  if (res.success) {
    toast('Tersimpan ✔ status exam sudah ditandai "Sudah Dibuat"', 'success');
    examPendingLoaded = false; // supaya daftar pending di-refresh lagi
    loadPendingExams();
  } else {
    toast(res.error || 'Gagal menyimpan ke sistem.', 'error');
  }
}
