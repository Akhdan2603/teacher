// ============================================================
// HEALTH CHECK — validasi setup sistem dari UI (tombol di footer)
// Depends on: app.js (toast), api.js
// ============================================================

const HC_STATUS_ICON = { ok: '✅', warning: '⚠️', error: '❌' };

async function runHealthCheckUI() {
  const modal = document.getElementById('health-check-modal');
  const body = document.getElementById('hc-modal-body');
  modal.style.display = 'flex';
  body.innerHTML = '<div class="hc-loading">Memeriksa setup sistem...</div>';

  const res = await apiHealthCheck();

  if (!res.success) {
    body.innerHTML = `<div class="hc-loading">Gagal menjalankan health check: ${escHtml(res.error || 'unknown error')}</div>`;
    return;
  }

  const checks = res.checks || [];
  const errorCount = checks.filter(c => c.status === 'error').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const okCount = checks.filter(c => c.status === 'ok').length;

  const summaryHtml = `
    <div class="hc-summary">
      <span class="hc-summary-item hc-ok">✅ ${okCount} OK</span>
      <span class="hc-summary-item hc-warning">⚠️ ${warningCount} Warning</span>
      <span class="hc-summary-item hc-error">❌ ${errorCount} Error</span>
    </div>`;

  const rowsHtml = checks.map(c => `
    <div class="hc-row hc-row-${c.status}">
      <span class="hc-row-icon">${HC_STATUS_ICON[c.status] || '❔'}</span>
      <div class="hc-row-text">
        <div class="hc-row-name">${escHtml(c.name)}</div>
        <div class="hc-row-message">${escHtml(c.message)}</div>
      </div>
    </div>`).join('');

  body.innerHTML = summaryHtml + '<div class="hc-rows">' + rowsHtml + '</div>';
}

function closeHealthCheckModal() {
  document.getElementById('health-check-modal').style.display = 'none';
}
