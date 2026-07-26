// ============================================================
// AUTH — pilih nama guru + PIN, sekali login tersimpan di browser
// ============================================================
// Ini BUKAN keamanan tingkat tinggi (sesuai kebutuhan project ini:
// cuma gerbang identitas ringan, bukan proteksi data sensitif).
// Setelah berhasil login, identitas disimpan di localStorage supaya
// guru tidak perlu login ulang tiap buka web.
// ============================================================

const AUTH_STORAGE_KEY = 'timedoor_teacher_session';

function getSavedTeacher() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveTeacherSession(teacherName) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ teacher: teacherName, since: Date.now() }));
}

function logoutTeacher() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  location.reload();
}

function getCurrentTeacher() {
  const session = getSavedTeacher();
  return session ? session.teacher : null;
}

// ------------------------------------------------------------
// Render overlay login. Dipanggil otomatis saat halaman load
// (lihat pemanggilan di bagian bawah file ini).
// ------------------------------------------------------------
async function initAuthGate() {
  const saved = getSavedTeacher();
  if (saved && saved.teacher) {
    // sudah pernah login, langsung tampilkan app
    document.body.classList.add('auth-ok');
    injectTeacherBadge_(saved.teacher);
    return;
  }

  renderLoginOverlay_();
  const res = await apiGetTeachers();
  const select = document.getElementById('auth-teacher-select');
  if (res.success && select) {
    select.innerHTML = '<option value="">-- Pilih Nama --</option>' +
      res.teachers.map(t => `<option value="${escHtmlAuth_(t)}">${escHtmlAuth_(t)}</option>`).join('');
  } else if (select) {
    select.innerHTML = '<option value="">Gagal memuat daftar guru</option>';
  }
}

function renderLoginOverlay_() {
  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <div class="auth-box">
      <h2>Meeting Report Generator</h2>
      <p>Pilih nama Anda dan masukkan PIN untuk masuk.</p>
      <select id="auth-teacher-select"><option value="">Memuat...</option></select>
      <input type="password" id="auth-pin-input" placeholder="PIN 4 digit" maxlength="4" inputmode="numeric">
      <button id="auth-login-btn" onclick="handleLoginClick()">Masuk</button>
      <div id="auth-error" class="auth-error"></div>
    </div>
  `;
  document.body.appendChild(overlay);
}

async function handleLoginClick() {
  const name = document.getElementById('auth-teacher-select').value;
  const pin = document.getElementById('auth-pin-input').value;
  const errorEl = document.getElementById('auth-error');
  errorEl.textContent = '';

  if (!name) { errorEl.textContent = 'Pilih nama guru dulu.'; return; }
  if (!pin || pin.length !== 4) { errorEl.textContent = 'PIN harus 4 digit.'; return; }

  const btn = document.getElementById('auth-login-btn');
  btn.disabled = true;
  btn.textContent = 'Memeriksa...';

  const res = await apiLogin(name, pin);

  btn.disabled = false;
  btn.textContent = 'Masuk';

  if (res.success) {
    saveTeacherSession(res.teacher);
    document.getElementById('auth-overlay').remove();
    document.body.classList.add('auth-ok');
    injectTeacherBadge_(res.teacher);
    if (typeof onLoginSuccess === 'function') onLoginSuccess(res.teacher);
  } else {
    errorEl.textContent = res.error || 'Login gagal.';
  }
}

function injectTeacherBadge_(teacherName) {
  const nav = document.querySelector('.topnav');
  if (!nav || document.getElementById('teacher-badge')) return;
  const badge = document.createElement('div');
  badge.id = 'teacher-badge';
  badge.style.cssText = 'margin-left:auto;display:flex;align-items:center;gap:8px;font-size:13px;color:#555;';
  badge.innerHTML = `<span>👤 ${escHtmlAuth_(teacherName)}</span><button onclick="logoutTeacher()" style="font-size:12px;padding:4px 8px;cursor:pointer;">Ganti Guru</button>`;
  nav.appendChild(badge);
}

function escHtmlAuth_(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initAuthGate);
