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
}

function renderLoginOverlay_() {
  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <div class="auth-box">
      <h2>Meeting Report Generator</h2>
      <p>Masukkan PIN Anda untuk masuk.</p>
      <input type="password" id="auth-pin-input" placeholder="PIN 4 digit" maxlength="4" inputmode="numeric" autofocus>
      <button id="auth-login-btn" onclick="handleLoginClick()">Masuk</button>
      <div id="auth-error" class="auth-error"></div>
      <button type="button" id="btn-health-check" onclick="runHealthCheckUI()" title="Cek kesiapan setup sistem" style="margin-top:14px;">🩺 Health Check</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Enter di keyboard HP langsung submit, tidak perlu tap tombol
  document.getElementById('auth-pin-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLoginClick();
  });
}

async function handleLoginClick() {
  const pin = document.getElementById('auth-pin-input').value;
  const errorEl = document.getElementById('auth-error');
  errorEl.textContent = '';

  if (!pin || pin.length !== 4) { errorEl.textContent = 'PIN harus 4 digit.'; return; }

  const btn = document.getElementById('auth-login-btn');
  btn.disabled = true;
  btn.textContent = 'Memeriksa...';

  const res = await apiLogin(pin);

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
