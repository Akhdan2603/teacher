// ============================================================
// AUTO TAB — Daily Auto Report (landing page utama aplikasi)
// Depends on: app.js, photo-manager.js, pdf-builder.js, api.js, auth.js
// ============================================================

let autoStudents = [];
let autoLang = 'en'; // Default English

const LANG_UI = {
  id: {
    cardTitle: 'Data Siswa & Generate Laporan',
    addBtn: '+ Tambah Siswa',
    waBtn: 'Kirim ke WhatsApp',
    waTitle: 'Preview Pesan WhatsApp',
    tip: '<strong>Cara pakai:</strong> Masukkan nama siswa → pilih kriteria, course, dan status lesson → klik ⚡ Generate untuk auto-generate teks progress.',
    previewLabel: 'Live Preview — Report',
    rptTitle: 'Laporan Progress<br><span>Siswa</span>',
    labelKelas: 'Kelas',
    labelTanggal: 'Tanggal',
    photo1: 'Foto 1', photo2: 'Foto 2',
    thName: 'Nama Siswa', thProgress: 'Progress Hari Ini',
    critPlaceholder: '— Kriteria —',
    coursePlaceholder: '— Course —',
    lessonPlaceholder: '— Lesson —',
    lesson2Placeholder: '— Lesson ke-2 —',
    statusDone: '✓ Selesai 1 Lesson',
    statusInProgress: '⏳ Belum Selesai (1 Lesson In Progress)',
    statusOneAndHalf: '🌖 Selesai 1.5 Lesson (1 Selesai + 1 Lanjut)',
    statusDouble: '🚀 Selesai 2 Lesson',
    generateBtn: '⚡ Generate Progress',
    studentPlaceholder: 'Nama siswa…',
    progressPlaceholder: 'Progress akan ter-generate otomatis, atau ketik manual…',
    toastGenerated: '✓ Progress berhasil di-generate!',
    errName: 'Masukkan nama siswa dulu!',
    errCourse: 'Pilih course terlebih dahulu!',
    errLesson: 'Pilih lesson terlebih dahulu!',
    errLesson2: 'Pilih lesson ke-2 terlebih dahulu!',
    errMinStudent: 'Minimum 1 siswa.',
    fallbackProgress: (nama, lessonNum, course) => `${nama} telah menyelesaikan *Lesson ${lessonNum}* pada course ${course}.`,
    inProgressText: (nama, lessonNum, lessonTitle) => `${nama} sedang mempelajari *Lesson ${lessonNum}* (${lessonTitle}). ${nama} telah memahami konsep dasarnya dan akan melanjutkan penyelesaian projek pada pertemuan berikutnya.`,
    oneAndHalfText: (nama, l1Num, t1, l2Num, l2Title) => `${nama} telah menyelesaikan *Lesson ${l1Num}* hari ini, serta mulai mempelajari materi *Lesson ${l2Num}* (${l2Title}) yang akan dilanjutkan pada pertemuan berikutnya.\n\n• *Lesson ${l1Num}*: ${t1}`,
    doubleText: (nama, l1Num, t1, l2Num, t2) => `${nama} telah menyelesaikan 2 lesson pada pertemuan hari ini (*Lesson ${l1Num}* & *Lesson ${l2Num}*).\n\n• *Lesson ${l1Num}*: ${t1}\n• *Lesson ${l2Num}*: ${t2}`,
    waGreeting: (kelas, tgl) => `Selamat siang Bapak/Ibu Parents, ✨\n\nBerikut adalah laporan ringkas mengenai aktivitas dan perkembangan belajar anak-anak pada pertemuan kelas hari ini:\n\n📌 *Kelas:* ${kelas}\n📅 *Tanggal:* ${tgl}`,
    waClose: 'Terima kasih atas perhatian dan dukungan Bapak/Ibu. Jika ada pertanyaan mengenai materi hari ini, jangan ragu untuk menghubungi kami.\n\nSemoga harinya menyenangkan! 😊',
    pdfTitle: 'Laporan Progress Siswa',
    pdfLabelKelas: 'Kelas: ', pdfOffsetKelas: 32,
    pdfLabelTanggal: 'Tanggal: ', pdfOffsetTanggal: 38,
    pdfColName: 'NAMA SISWA', pdfColProgress: 'PROGRESS HARI INI',
    pdfPhotoEmpty: (i) => `Foto ${i} belum diupload`,
    fileName: (kelas) => `Rapor_${kelas}`,
  },
  en: {
    cardTitle: 'Student Data & Generate Report',
    addBtn: '+ Add Student',
    waBtn: 'Send to WhatsApp',
    waTitle: 'WhatsApp Message Preview',
    tip: '<strong>How to use:</strong> Enter student name → choose level, course, and lesson status → click ⚡ Generate to auto-create progress text.',
    previewLabel: 'Live Preview — Report',
    rptTitle: 'Student<br><span>Progress Report</span>',
    labelKelas: 'Class',
    labelTanggal: 'Date',
    photo1: 'Photo 1', photo2: 'Photo 2',
    thName: 'Student Name', thProgress: "Today's Progress",
    critPlaceholder: '— Level —',
    coursePlaceholder: '— Course —',
    lessonPlaceholder: '— Lesson —',
    lesson2Placeholder: '— 2nd Lesson —',
    statusDone: '✓ Completed 1 Lesson',
    statusInProgress: '⏳ In Progress (1 Unfinished Lesson)',
    statusOneAndHalf: '🌖 Completed 1.5 Lessons (1 Finished + 1 In Progress)',
    statusDouble: '🚀 Completed 2 Lessons',
    generateBtn: '⚡ Generate Report',
    studentPlaceholder: 'Student name…',
    progressPlaceholder: 'Progress will be auto-generated, or type manually…',
    toastGenerated: '✓ Progress generated!',
    errName: 'Please enter the student name first!',
    errCourse: 'Please select a course first!',
    errLesson: 'Please select a lesson first!',
    errLesson2: 'Please select the 2nd lesson first!',
    errMinStudent: 'Minimum 1 student.',
    fallbackProgress: (nama, lessonNum, course) => `${nama} completed *Lesson ${lessonNum}* in the ${course} course today.`,
    inProgressText: (nama, lessonNum, lessonTitle) => `${nama} is currently working on *Lesson ${lessonNum}* (${lessonTitle}). ${nama} has understood the core concepts and will continue the project in the next session.`,
    oneAndHalfText: (nama, l1Num, t1, l2Num, l2Title) => `${nama} completed *Lesson ${l1Num}* today and started working on *Lesson ${l2Num}* (${l2Title}), which will be continued in the next session.\n\n• *Lesson ${l1Num}*: ${t1}`,
    doubleText: (nama, l1Num, t1, l2Num, t2) => `${nama} completed 2 lessons in today's session (*Lesson ${l1Num}* & *Lesson ${l2Num}*).\n\n• *Lesson ${l1Num}*: ${t1}\n• *Lesson ${l2Num}*: ${t2}`,
    waGreeting: (kelas, tgl) => `Good afternoon parents, ✨\n\nHere is a quick update on our students' progress in today's class:\n\n📌 *Class:* ${kelas}\n📅 *Date:* ${tgl}`,
    waClose: 'Thank you for your continued support! If you have any questions about today\'s lesson, feel free to reach out.\n\nHave a wonderful day! 😊',
    pdfTitle: 'Student Progress Report',
    pdfLabelKelas: 'Class: ', pdfOffsetKelas: 26,
    pdfLabelTanggal: 'Date: ', pdfOffsetTanggal: 28,
    pdfColName: 'STUDENT NAME', pdfColProgress: "TODAY'S PROGRESS",
    pdfPhotoEmpty: (i) => `Photo ${i} not uploaded`,
    fileName: (kelas) => `Report_${kelas}`,
  }
};

function setLang(lang){
  autoLang = lang;
  document.getElementById('lang-btn-id').classList.toggle('active', lang==='id');
  document.getElementById('lang-btn-en').classList.toggle('active', lang==='en');
  const L = LANG_UI[lang];
  
  const studentCardTitle = document.getElementById('auto-student-card-title');
  if(studentCardTitle) studentCardTitle.textContent = L.cardTitle;
  const autoAddBtn = document.getElementById('auto-add-btn');
  if(autoAddBtn) autoAddBtn.textContent = L.addBtn;
  const autoWaBtn = document.getElementById('abtn-wa');
  if(autoWaBtn) autoWaBtn.textContent = L.waBtn;
  const autoWaTitle = document.getElementById('auto-wa-title');
  if(autoWaTitle) autoWaTitle.textContent = L.waTitle;
  const autoTipBox = document.getElementById('auto-tip-box');
  if(autoTipBox) autoTipBox.innerHTML = L.tip;
  const autoPreviewLabel = document.getElementById('auto-preview-label-text');
  if(autoPreviewLabel) autoPreviewLabel.textContent = L.previewLabel;
  const autoRptTitle = document.getElementById('auto-rpt-title');
  if(autoRptTitle) autoRptTitle.innerHTML = L.rptTitle;
  const autoLabelKelas = document.getElementById('auto-label-kelas');
  if(autoLabelKelas) autoLabelKelas.textContent = L.labelKelas;
  const autoLabelTanggal = document.getElementById('auto-label-tanggal');
  if(autoLabelTanggal) autoLabelTanggal.textContent = L.labelTanggal;
  
  const photoSecTitle = document.getElementById('auto-photo-sec-title');
  if(photoSecTitle) photoSecTitle.textContent = lang === 'id' ? 'Foto Dokumentasi Kegiatan' : 'Classroom Activity Snapshots';
  const progressSecTitle = document.getElementById('auto-progress-sec-title');
  if(progressSecTitle) progressSecTitle.textContent = lang === 'id' ? 'Progress & Perkembangan Siswa' : 'Student Learning & Progress';
  
  const autoLegendDone = document.getElementById('auto-legend-done');
  if(autoLegendDone) autoLegendDone.textContent = lang === 'id' ? 'Selesai Lesson' : 'Completed Lesson';
  const autoLegendProg = document.getElementById('auto-legend-prog');
  if(autoLegendProg) autoLegendProg.textContent = lang === 'id' ? 'Dalam Proses' : 'In Progress';
  
  renderAutoInputs();
}

function populateCourseDropdown(idx) {
  const courseSelect = document.getElementById(`auto-course-${idx}`);
  if (!courseSelect) return;
  const s = autoStudents[idx];
  courseSelect.innerHTML = `<option value="">${LANG_UI[autoLang].coursePlaceholder}</option>`;
  if (s.criteria && COURSE_MAP[s.criteria]) {
    COURSE_MAP[s.criteria].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      if (c === s.course) opt.selected = true;
      courseSelect.appendChild(opt);
    });
  }
}

function populateLessonDropdown(idx) {
  const lessonSelect = document.getElementById(`auto-lesson-${idx}`);
  const lesson2Select = document.getElementById(`auto-lesson2-${idx}`);
  if (!lessonSelect) return;
  const s = autoStudents[idx];
  
  lessonSelect.innerHTML = `<option value="">${LANG_UI[autoLang].lessonPlaceholder}</option>`;
  if (lesson2Select) {
    lesson2Select.innerHTML = `<option value="">${LANG_UI[autoLang].lesson2Placeholder}</option>`;
    lesson2Select.style.display = (s.status === 'double' || s.status === 'one_and_half') ? 'block' : 'none';
  }
  
  if (s.course && COURSE_DATA[s.course]) {
    COURSE_DATA[s.course].forEach(l => {
      const opt1 = document.createElement('option');
      opt1.value = l.num; opt1.textContent = `${l.title}`;
      if (String(l.num) === String(s.lesson)) opt1.selected = true;
      lessonSelect.appendChild(opt1);
      
      if (lesson2Select) {
        const opt2 = document.createElement('option');
        opt2.value = l.num; opt2.textContent = `${l.title}`;
        if (String(l.num) === String(s.lesson2)) opt2.selected = true;
        lesson2Select.appendChild(opt2);
      }
    });
  }
}

function onCriteriaChange(idx, selectEl) {
  autoStudents[idx].criteria = selectEl.value;
  autoStudents[idx].course = '';
  autoStudents[idx].lesson = '';
  autoStudents[idx].lesson2 = '';
  populateCourseDropdown(idx);
  populateLessonDropdown(idx);
  autoUpdateTable();
}

function onCourseChange(idx, selectEl) {
  autoStudents[idx].course = selectEl.value;
  autoStudents[idx].lesson = '';
  autoStudents[idx].lesson2 = '';
  populateLessonDropdown(idx);
  autoUpdateTable();
}

function onStatusChange(idx, selectEl) {
  const status = selectEl.value;
  autoStudents[idx].status = status;
  const lesson2Select = document.getElementById(`auto-lesson2-${idx}`);
  if (lesson2Select) {
    lesson2Select.style.display = (status === 'double' || status === 'one_and_half') ? 'block' : 'none';
  }
  autoUpdateTable();
}

function onLessonChange(idx, selectEl) {
  autoStudents[idx].lesson = selectEl.value;
  autoUpdateTable();
}

function onLesson2Change(idx, selectEl) {
  autoStudents[idx].lesson2 = selectEl.value;
  autoUpdateTable();
}

function generateProgress(idx) {
  syncStudentFromDOM(idx);
  const s = autoStudents[idx];
  const sLang = s.lang || autoLang;
  const L = LANG_UI[sLang];

  if (!s.nama || !s.nama.trim()) { toast(L.errName, 'error'); return; }
  if (!s.course) { toast(L.errCourse, 'error'); return; }
  if (!s.lesson) { toast(L.errLesson, 'error'); return; }
  if ((s.status === 'double' || s.status === 'one_and_half') && !s.lesson2) { toast(L.errLesson2, 'error'); return; }

  const courseList = COURSE_DATA[s.course];
  const l1Obj = courseList ? courseList.find(item => item.num == s.lesson) : null;
  const l2Obj = (courseList && s.lesson2) ? courseList.find(item => item.num == s.lesson2) : null;

  let text = '';
  const templateMap = sLang === 'en' ? TEMPLATES_EN : TEMPLATES;
  const t1 = (templateMap[s.course] && templateMap[s.course][s.lesson])
    ? templateMap[s.course][s.lesson].replace(/{nama}/g, s.nama)
    : L.fallbackProgress(s.nama, s.lesson, s.course);

  if (s.status === 'done') {
    text = t1;
  } else if (s.status === 'in_progress') {
    const lessonTitle = l1Obj ? l1Obj.title : `Lesson ${s.lesson}`;
    text = L.inProgressText(s.nama, s.lesson, lessonTitle);
  } else if (s.status === 'one_and_half') {
    const l2Title = l2Obj ? l2Obj.title : `Lesson ${s.lesson2}`;
    text = L.oneAndHalfText(s.nama, s.lesson, t1, s.lesson2, l2Title);
  } else if (s.status === 'double') {
    const t2 = (templateMap[s.course] && templateMap[s.course][s.lesson2])
      ? templateMap[s.course][s.lesson2].replace(/{nama}/g, s.nama)
      : L.fallbackProgress(s.nama, s.lesson2, s.course);
    text = L.doubleText(s.nama, s.lesson, t1, s.lesson2, t2);
  }

  s.progress = text;
  const progEl = document.getElementById(`auto-progress-${idx}`);
  if (progEl) progEl.value = text;
  autoUpdateTable();
  toast(L.toastGenerated, 'success');

  // Simpan ke Google Sheets di background (tidak memblokir UI).
  // Kalau gagal (misal offline), guru tetap bisa lanjut export PDF/WA manual.
  submitDailyReportToSheet(idx);
}

function syncStudentFromDOM(idx) {
  if (!autoStudents[idx]) return;
  const nameEl = document.getElementById(`auto-name-${idx}`);
  if(nameEl) autoStudents[idx].nama = nameEl.value;
  const critEl = document.getElementById(`auto-criteria-${idx}`);
  if(critEl) autoStudents[idx].criteria = critEl.value;
  const courseEl = document.getElementById(`auto-course-${idx}`);
  if(courseEl) autoStudents[idx].course = courseEl.value;
  const lessonEl = document.getElementById(`auto-lesson-${idx}`);
  if(lessonEl) autoStudents[idx].lesson = lessonEl.value;
  const lesson2El = document.getElementById(`auto-lesson2-${idx}`);
  if(lesson2El) autoStudents[idx].lesson2 = lesson2El.value;
  const statusEl = document.getElementById(`auto-status-${idx}`);
  if(statusEl) autoStudents[idx].status = statusEl.value;
  const progEl = document.getElementById(`auto-progress-${idx}`);
  if(progEl) autoStudents[idx].progress = progEl.value;
}

function setStudentLang(idx, lang) {
  if (!autoStudents[idx]) return;
  syncStudentFromDOM(idx);
  autoStudents[idx].lang = lang;
  renderAutoInputs();
}

function renderAutoInputs(){
  const L = LANG_UI[autoLang];
  const c = document.getElementById('auto-students-container');
  c.innerHTML = '';
  autoStudents.forEach((s,i) => {
    const sLang = s.lang || autoLang;
    const sStatus = s.status || 'done';
    s.lang = sLang;
    s.status = sStatus;

    const div = document.createElement('div');
    div.className = 'student-card';
    div.innerHTML = `
      <div class="student-card-header">
        <div class="student-num">${i+1}</div>
        <input type="text" id="auto-name-${i}" placeholder="${L.studentPlaceholder}" value="${escHtml(s.nama)}" oninput="autoStudents[${i}].nama=this.value;autoUpdateTable()">
        <div class="student-lang-toggle" title="Student Report Language">
          <button type="button" class="student-lang-btn ${sLang==='id'?'active':''}" onclick="setStudentLang(${i},'id')">ID</button>
          <button type="button" class="student-lang-btn ${sLang==='en'?'active':''}" onclick="setStudentLang(${i},'en')">EN</button>
        </div>
        <button class="btn-del" onclick="removeAutoStudent(${i})" title="Remove">×</button>
      </div>
      <div class="auto-gen-row">
        <div class="auto-gen-selectors" style="flex-wrap:wrap;">
          <select id="auto-criteria-${i}" onchange="onCriteriaChange(${i},this)" style="flex:1;min-width:100px;">
            <option value="">${L.critPlaceholder}</option>
            <option value="Junior" ${s.criteria==='Junior'?'selected':''}>Junior</option>
            <option value="Kids" ${s.criteria==='Kids'?'selected':''}>Kids</option>
            <option value="Teens" ${s.criteria==='Teens'?'selected':''}>Teens</option>
          </select>
          <select id="auto-course-${i}" onchange="onCourseChange(${i},this)" style="flex:1.8;min-width:130px;">
            <option value="">${L.coursePlaceholder}</option>
          </select>
          <select id="auto-status-${i}" onchange="onStatusChange(${i},this)" style="flex:1.4;min-width:140px;">
            <option value="done" ${sStatus==='done'?'selected':''}>${L.statusDone}</option>
            <option value="in_progress" ${sStatus==='in_progress'?'selected':''}>${L.statusInProgress}</option>
            <option value="one_and_half" ${sStatus==='one_and_half'?'selected':''}>${L.statusOneAndHalf}</option>
            <option value="double" ${sStatus==='double'?'selected':''}>${L.statusDouble}</option>
          </select>
        </div>
        <div class="auto-gen-selectors" style="margin-top:4px;">
          <select id="auto-lesson-${i}" style="flex:1" onchange="onLessonChange(${i},this)">
            <option value="">${L.lessonPlaceholder}</option>
          </select>
          <select id="auto-lesson2-${i}" style="flex:1; display:${(sStatus==='double'||sStatus==='one_and_half')?'block':'none'}" onchange="onLesson2Change(${i},this)">
            <option value="">${L.lesson2Placeholder}</option>
          </select>
        </div>
        <button class="btn-generate" onclick="generateProgress(${i})" style="margin-top:4px;">${L.generateBtn}</button>
      </div>
      <textarea id="auto-progress-${i}" placeholder="${L.progressPlaceholder}" oninput="autoStudents[${i}].progress=this.value;autoUpdateTable()" style="min-height:100px">${escHtml(s.progress)}</textarea>
      <div class="checkpoint-actions">
        <button type="button" class="btn-checkpoint btn-remind" onclick="handleRequestReminder(${i})">⏰ Ingatkan Report</button>
        <button type="button" class="btn-checkpoint btn-done" onclick="handleMarkReportDone(${i})">✅ Report Telah Selesai</button>
        <button type="button" class="btn-checkpoint btn-absent" onclick="handleMarkAbsent(${i})">🚫 Tidak Hadir</button>
      </div>`;
    c.appendChild(div);
    
    populateCourseDropdown(i);
    populateLessonDropdown(i);
  });
  autoUpdateTable();
}

// ============================================================
// CHECKPOINT ACTIONS — tombol manual "Ingatkan Report" & "Report Telah Selesai"
// ============================================================
async function handleRequestReminder(idx) {
  const s = autoStudents[idx];
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const kelas = document.getElementById('auto-kelas').value;
  const namaLengkap = s.namaLengkap || s.nama;

  if (!teacher) { toast('Sesi login tidak ditemukan, silakan login ulang.', 'error'); return; }
  if (!kelas || !namaLengkap) { toast('Isi dulu Kelas dan Nama Murid.', 'error'); return; }

  toast('Mengirim reminder...', 'success');
  const res = await apiRequestReminder({ teacher, kelas, namaLengkap });

  if (res.success) {
    const calNote = res.calendarCreated ? ' + undangan Google Calendar' : ' (Calendar dilewati: email guru belum terdaftar)';
    toast(`Reminder Lesson ${res.checkpoint} terkirim ke Telegram${calNote} ✔`, 'success');
  } else {
    toast(res.error || 'Gagal mengirim reminder.', 'error');
  }
}

async function handleMarkReportDone(idx) {
  const s = autoStudents[idx];
  const kelas = document.getElementById('auto-kelas').value;
  const namaLengkap = s.namaLengkap || s.nama;

  if (!kelas || !namaLengkap) { toast('Isi dulu Kelas dan Nama Murid.', 'error'); return; }

  const res = await apiMarkReportDone({ kelas, namaLengkap });

  if (res.success) {
    toast(`Report Lesson ${res.checkpoint} ditandai selesai ✔`, 'success');
  } else {
    toast(res.error || 'Gagal menandai selesai (mungkin tidak ada checkpoint pending).', 'error');
  }
}

async function handleMarkAbsent(idx) {
  const s = autoStudents[idx];
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const kelas = document.getElementById('auto-kelas').value;
  const namaLengkap = s.namaLengkap || s.nama;

  if (!teacher) { toast('Sesi login tidak ditemukan, silakan login ulang.', 'error'); return; }
  if (!kelas || !namaLengkap) { toast('Isi dulu Kelas dan Nama Murid.', 'error'); return; }

  const res = await apiMarkAbsent({ teacher, kelas, namaLengkap, namaPanggilan: s.nama });

  if (res.success) {
    toast(`${s.nama} ditandai tidak hadir — dihapus dari daftar laporan hari ini ✔`, 'success');
    // Hapus dari daftar aktif supaya tidak ikut muncul di tabel, teks WA,
    // maupun PDF/PNG — laporan hari ini hanya untuk murid yang hadir.
    autoStudents.splice(idx, 1);
    renderAutoInputs();
    autoUpdateTable();
    autoUpdatePreview();
  } else {
    toast(res.error || 'Gagal menandai tidak hadir.', 'error');
  }
}

// ============================================================
// INTEGRASI JADWAL DARI GOOGLE SHEETS (via Apps Script)
// ============================================================
let _jadwalData = null; // cache hasil fetch terakhir: { success, kelas: {...} }

async function loadMuridFromJadwal() {
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const hari = document.getElementById('jadwal-hari-select').value;

  if (!teacher) { toast('Sesi login tidak ditemukan, silakan login ulang.', 'error'); return; }
  if (!hari) { toast('Pilih hari dulu.', 'error'); return; }

  toast('Memuat jadwal...', 'info');
  const res = await apiGetJadwal(teacher, hari);

  if (!res.success) {
    toast(res.error || 'Gagal memuat jadwal.', 'error');
    return;
  }

  _jadwalData = res;
  const kelasNames = Object.keys(res.kelas || {});
  const kelasSelect = document.getElementById('jadwal-kelas-select');

  if (kelasNames.length === 0) {
    kelasSelect.innerHTML = '<option value="">Tidak ada kelas di hari ini</option>';
    toast('Tidak ada kelas terjadwal untuk hari ini.', 'error');
    return;
  }

  kelasSelect.innerHTML = '<option value="">-- Pilih Kelas --</option>' +
    kelasNames.map(k => `<option value="${escHtml(k)}">${escHtml(k)} (${res.kelas[k].length} murid)</option>`).join('');

  // Kalau cuma 1 kelas hari itu, langsung auto-pilih & isi murid
  if (kelasNames.length === 1) {
    kelasSelect.value = kelasNames[0];
    onJadwalKelasChange();
  } else {
    toast(`${kelasNames.length} kelas ditemukan, silakan pilih kelasnya.`, 'success');
  }
}

function onJadwalKelasChange() {
  const kelasName = document.getElementById('jadwal-kelas-select').value;
  if (!kelasName || !_jadwalData) return;

  const students = _jadwalData.kelas[kelasName] || [];
  autoStudents = students.map(st => ({
    namaLengkap: st.namaLengkap || '',
    nama: st.namaPanggilan || st.namaLengkap || '', // "nama" = nama panggilan, dipakai di teks laporan
    progress: '',
    criteria: '',
    course: st.course || '',
    lesson: st.lesson || '',
    lesson2: '',
    status: 'done',
    lang: autoLang,
  }));

  const kelasInput = document.getElementById('auto-kelas');
  if (kelasInput) kelasInput.value = kelasName;

  renderAutoInputs();
  autoUpdatePreview();
  toast(`${students.length} murid dimuat untuk kelas ${kelasName}.`, 'success');
}

// Dipanggil auth.js setelah login sukses (opsional hook, saat ini belum
// dipakai untuk apa-apa secara default, disediakan untuk pengembangan lanjut)
function onLoginSuccess(teacherName) {
  // placeholder — bisa dipakai nanti misal auto-set default Hari = hari ini
}

// ============================================================
// SUBMIT LAPORAN KE GOOGLE SHEETS (dipanggil dari generateProgress)
// ============================================================
async function submitDailyReportToSheet(idx) {
  const s = autoStudents[idx];
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const hari = document.getElementById('jadwal-hari-select').value;
  const kelas = document.getElementById('auto-kelas').value;
  const namaLengkap = s.namaLengkap || s.nama; // fallback: manual entry tanpa "Muat Jadwal"

  if (!teacher || !hari || !kelas || !namaLengkap || !s.course || !s.lesson) {
    // Data belum lengkap (misal guru isi manual tanpa "Muat Jadwal") —
    // tidak apa-apa, biarkan silent karena ini fitur tambahan, bukan wajib
    // untuk tetap bisa export PDF/PNG/WA seperti biasa.
    return;
  }

  const res = await apiSubmitDaily({
    teacher, hari, kelas,
    namaLengkap,
    namaPanggilan: s.nama,
    criteria: s.criteria,
    course: s.course,
    lesson: s.lesson,
    status: s.status,
    noteText: s.progress,
  });

  if (res.success) {
    toast('Tersimpan ke sistem ✔', 'success');
  } else {
    console.warn('Gagal submit ke sheet:', res.error);
    toast('Laporan dibuat, tapi gagal tersimpan ke sistem (cek koneksi).', 'error');
  }
}

function addAutoStudent(){
  autoStudents.forEach((_, idx) => syncStudentFromDOM(idx));
  autoStudents.push({nama:'',progress:'',criteria:'',course:'',lesson:'',lesson2:'',status:'done',lang:autoLang});
  renderAutoInputs();
  const cards = document.querySelectorAll('#auto-students-container .student-card');
  if(cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth',block:'nearest'});
}

function removeAutoStudent(i){
  const L = LANG_UI[autoLang];
  if(autoStudents.length<=1){toast(L.errMinStudent,'error');return;}
  autoStudents.splice(i,1);
  renderAutoInputs();
}

function autoUpdateTable(){
  const tbody = document.getElementById('aprev-tbody');
  tbody.innerHTML = '';
  autoStudents.forEach(s => {
    if(!s.nama && !s.progress) return;
    
    // Status dot color
    const isDone = s.status === 'done' || s.status === 'double';
    const dotClass = isDone ? 'dot-done' : 'dot-progress';
    
    const lessonTag = getLessonTag(s);
    
    const div = document.createElement('div');
    div.className = 'rpt-student-card';
    div.innerHTML = `
      <div class="card-status-col">
        <div class="timeline-node"><span class="timeline-dot ${dotClass}"></span></div>
      </div>
      <div class="card-name-col">
        <span class="student-name-text">${escHtml(s.nama) || '<em style="color:#94a3b8">—</em>'}</span>
      </div>
      <div class="card-lesson-col">
        ${lessonTag ? `<span class="lesson-pill">${escHtml(lessonTag)}</span>` : ''}
      </div>
      <div class="card-progress-col">
        ${formatProgressHTML(s.progress)}
      </div>
    `;
    tbody.appendChild(div);
  });
  autoUpdateWA();
  fitPreviewScale();
}

function autoUpdatePreview(){
  const kelas = document.getElementById('auto-kelas').value || '—';
  const tgl = document.getElementById('auto-tanggal').value;
  document.getElementById('aprev-kelas').textContent = kelas;
  document.getElementById('aprev-tanggal').textContent = formatDate(tgl);
  autoUpdateWA();
}

function buildAutoWAMessage(){
  const L = LANG_UI[autoLang];
  const tgl = document.getElementById('auto-tanggal').value;
  const kelas = document.getElementById('auto-kelas').value || '—';
  const studentLines = autoStudents.map(s => {
    if(!s.nama && !s.progress) return '';
    return `*${s.nama||'—'}*\n${s.progress||'—'}`;
  }).filter(Boolean).join('\n\n');
  return `${L.waGreeting(kelas, formatDateLong(tgl, autoLang))}\n\n${studentLines}\n\n${L.waClose}`;
}

function autoUpdateWA(){
  document.getElementById('auto-wa-bubble').textContent = buildAutoWAMessage();
}


async function downloadAutoPNG(){
  const btn=document.getElementById('abtn-png'); btn.disabled=true; btn.textContent='Processing...';
  toast('Creating PNG...');
  try{
    const canvas = await capturePNG('auto-report-preview');
    const link = document.createElement('a');
    const L = LANG_UI[autoLang];
    const kelas = document.getElementById('auto-kelas').value.replace(/\s+/g,'_')||'Report';
    link.download=`${L.fileName(kelas)}.png`; link.href=canvas.toDataURL('image/png'); link.click();
    toast('PNG downloaded!','success');
  }catch(err){toast('Error: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Download PNG';}
}

async function openAutoWhatsApp(){
  const L = LANG_UI[autoLang];
  const btn=document.getElementById('abtn-wa'); btn.disabled=true; btn.textContent='Preparing...';
  try{
    const canvas = await capturePNG('auto-report-preview');
    const link = document.createElement('a');
    const kelas = document.getElementById('auto-kelas').value.replace(/\s+/g,'_')||'Report';
    link.download=`${L.fileName(kelas)}.png`; link.href=canvas.toDataURL('image/png'); link.click();
    await new Promise(r=>setTimeout(r,800));
    window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(buildAutoWAMessage()),'_blank');
    toast('Done!','success');
  }catch(err){toast('Error: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent=L.waBtn;}
}

async function copyAutoWAMessage() {
  try {
    await navigator.clipboard.writeText(buildAutoWAMessage());
    toast(autoLang === 'en' ? 'WhatsApp message copied!' : 'Pesan WhatsApp disalin!', 'success');
  } catch(e) {
    const ta = document.createElement('textarea');
    ta.value = buildAutoWAMessage();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    toast(autoLang === 'en' ? 'WhatsApp message copied!' : 'Pesan WhatsApp disalin!', 'success');
  }
}

async function downloadAutoPDF(){
  const L = LANG_UI[autoLang];
  const kelas = document.getElementById('auto-kelas').value || '—';
  const tanggal = formatDate(document.getElementById('auto-tanggal').value);
  await downloadReportPDF({
    btnId: 'abtn-pdf',
    btnDefaultText: 'Export PDF',
    kelas, tanggal,
    photos: autoPhotoData,
    students: autoStudents,
    labels: {
      title: L.pdfTitle,
      labelKelas: L.pdfLabelKelas, offsetKelas: L.pdfOffsetKelas,
      labelTanggal: L.pdfLabelTanggal, offsetTanggal: L.pdfOffsetTanggal,
      colName: L.pdfColName, colProgress: L.pdfColProgress,
      photoEmpty: L.pdfPhotoEmpty,
      fileName: L.fileName(kelas.replace(/\s+/g,'_'))
    }
  });
}
