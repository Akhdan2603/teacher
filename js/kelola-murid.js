// ============================================================
// KELOLA MURID — lihat semua kelas guru (dikelompokkan per hari),
// tambah/hapus murid langsung dari sini.
// ============================================================

let muridLoaded = false;
let muridData = null; // cache hasil terakhir dari getClassesForTeacher

document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.tab-bar .tab-btn');
  const muridBtn = Array.from(btns).find(b => b.textContent.includes('Kelola Murid'));
  if (muridBtn) {
    muridBtn.addEventListener('click', () => {
      if (!muridLoaded) { loadKelolaMurid(); muridLoaded = true; }
    });
  }
});

async function loadKelolaMurid() {
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  const loadingEl = document.getElementById('murid-loading');
  const container = document.getElementById('murid-container');

  if (!teacher) { loadingEl.textContent = 'Sesi login tidak ditemukan.'; return; }

  loadingEl.style.display = 'block';
  loadingEl.textContent = 'Memuat data kelas...';
  container.innerHTML = '';

  const res = await apiGetClassesForTeacher(teacher);

  if (!res.success) {
    loadingEl.textContent = res.error || 'Gagal memuat data kelas.';
    return;
  }

  muridData = res.hari;
  loadingEl.style.display = 'none';
  renderKelolaMurid();
}

function renderKelolaMurid() {
  const container = document.getElementById('murid-container');
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  let html = '';
  hariList.forEach(hari => {
    const classMap = (muridData && muridData[hari]) || {};
    const kelasNames = Object.keys(classMap);

    html += `<div class="card murid-day-card">
      <div class="card-title">📅 ${hari}</div>`;

    if (kelasNames.length === 0) {
      html += `<div class="murid-empty">Belum ada kelas di hari ini.</div>`;
    } else {
      kelasNames.forEach(kelas => {
        const students = classMap[kelas];
        html += `<div class="murid-kelas-block">
          <div class="murid-kelas-title">${escHtml(kelas)} <span class="murid-count">(${students.length} murid)</span></div>
          <div class="murid-list">`;
        students.forEach(s => {
          html += `<div class="murid-chip">
            <div class="murid-chip-info">
              <span class="murid-chip-panggilan">${escHtml(s.namaPanggilan || s.namaLengkap)}</span>
              <span class="murid-chip-lengkap">${escHtml(s.namaLengkap)}</span>
            </div>
            <button type="button" class="murid-chip-del" onclick="handleRemoveStudent('${escHtml(hari)}','${escHtml(kelas)}','${escHtml(s.namaLengkap)}')" title="Hapus">✕</button>
          </div>`;
        });
        html += `</div>
          <button type="button" class="murid-add-dashed" onclick="showAddStudentForm(this,'${escHtml(hari)}','${escHtml(kelas)}')">+ Tambah Murid</button>
        </div>`;
      });
    }
    html += `</div>`;
  });

  container.innerHTML = html;
}

// Tombol dashed "+ Tambah Murid" per kelas — buka form inline persis di
// tempat tombolnya (pola sama seperti "+ Add Photo" yang dicontohkan).
function showAddStudentForm(btnEl, hari, kelas) {
  const formHtml = `
    <div class="murid-inline-form" id="murid-inline-form-temp">
      <input type="text" placeholder="Nama Lengkap" id="temp-lengkap">
      <input type="text" placeholder="Nama Panggilan" id="temp-panggilan">
      <button type="button" class="btn-dl" onclick="submitAddStudent(this)">✔</button>
      <button type="button" class="btn-cancel-inline" onclick="cancelAddStudentForm(this)">✕</button>
    </div>`;
  btnEl.insertAdjacentHTML('afterend', formHtml);
  btnEl.style.display = 'none';
  btnEl.dataset.hari = hari;
  btnEl.dataset.kelas = kelas;
  const form = btnEl.nextElementSibling;
  form.dataset.hari = hari;
  form.dataset.kelas = kelas;
  form.querySelector('#temp-lengkap').focus();
}

function cancelAddStudentForm(closeBtnEl) {
  const form = closeBtnEl.closest('.murid-inline-form');
  const dashedBtn = form.previousElementSibling;
  if (dashedBtn) dashedBtn.style.display = '';
  form.remove();
}

// Dipakai baik dari form inline per-kelas (btnEl ada) maupun dari card
// "Tambah Kelas / Murid Baru" di atas (btnEl = null, ambil dari input global).
async function submitAddStudent(btnEl) {
  const teacher = typeof getCurrentTeacher === 'function' ? getCurrentTeacher() : null;
  if (!teacher) { toast('Sesi login tidak ditemukan.', 'error'); return; }

  let hari, kelas, namaLengkap, namaPanggilan, form;

  if (btnEl) {
    form = btnEl.closest('.murid-inline-form');
    hari = form.dataset.hari;
    kelas = form.dataset.kelas;
    namaLengkap = form.querySelector('#temp-lengkap').value.trim();
    namaPanggilan = form.querySelector('#temp-panggilan').value.trim();
  } else {
    hari = document.getElementById('murid-new-hari').value;
    kelas = document.getElementById('murid-new-kelas').value.trim();
    namaLengkap = document.getElementById('murid-new-lengkap').value.trim();
    namaPanggilan = document.getElementById('murid-new-panggilan').value.trim();
  }

  if (!hari || !kelas || !namaLengkap || !namaPanggilan) {
    toast('Lengkapi semua field (Hari, Kelas, Nama Lengkap, Nama Panggilan).', 'error');
    return;
  }

  const res = await apiAddStudent({ teacher, hari, kelas, namaLengkap, namaPanggilan });

  if (res.success) {
    toast(`${namaPanggilan} berhasil ditambahkan ke ${kelas} (${hari}) ✔`, 'success');
    if (!btnEl) {
      document.getElementById('murid-new-kelas').value = '';
      document.getElementById('murid-new-lengkap').value = '';
      document.getElementById('murid-new-panggilan').value = '';
    }
    muridLoaded = false;
    loadKelolaMurid();
  } else {
    toast(res.error || 'Gagal menambahkan murid.', 'error');
  }
}

async function handleRemoveStudent(hari, kelas, namaLengkap) {
  if (!confirm(`Hapus "${namaLengkap}" dari kelas ${kelas} (${hari})?\n\nData riwayatnya tetap disimpan di tab "Drop" untuk arsip.`)) return;

  const res = await apiRemoveStudent({ hari, kelas, namaLengkap });

  if (res.success) {
    toast(`${namaLengkap} dihapus dari roster aktif (diarsipkan) ✔`, 'success');
    muridLoaded = false;
    loadKelolaMurid();
  } else {
    toast(res.error || 'Gagal menghapus murid.', 'error');
  }
}
