// ============================================================
// APP LOGIC — Main Application Functions & Rendering
// Depends on: data.js, templates.js
// ============================================================

let isAutoFit = { auto: true };

function fitPreviewScale() {
  const tab = 'auto';
  const previewId = 'auto-report-preview';
  const wrapperId = 'wrapper-' + tab;
  const scrollId = 'scroll-' + tab;
  const btnId = 'btn-zoom-' + tab;

  const el = document.getElementById(previewId);
  const wrapper = document.getElementById(wrapperId);
  const scroll = document.getElementById(scrollId);
  const btn = document.getElementById(btnId);

  if (!el || !wrapper || !scroll) return;

  const containerWidth = scroll.clientWidth;
  const targetWidth = 1000;

  if (isAutoFit[tab] && containerWidth > 0 && containerWidth < targetWidth) {
    const scale = containerWidth / targetWidth;
    el.style.transform = `scale(${scale})`;
    el.style.transformOrigin = 'top left';
    wrapper.style.height = Math.ceil(el.offsetHeight * scale) + 'px';
    wrapper.style.width = '100%';
    scroll.style.overflowX = 'hidden';
    if (btn) btn.innerHTML = '🔍 100% Size';
  } else {
    el.style.transform = 'none';
    wrapper.style.height = 'auto';
    wrapper.style.width = '1000px';
    scroll.style.overflowX = 'auto';
    if (btn) btn.innerHTML = '🔍 Fit to Screen';
  }
}

function toggleZoomMode(tab) {
  isAutoFit[tab] = !isAutoFit[tab];
  fitPreviewScale();
}

window.addEventListener('resize', fitPreviewScale);

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (window.event && window.event.target) window.event.target.classList.add('active');
  setTimeout(fitPreviewScale, 50);
}

// ============================================================
// UTILS
// ============================================================
const HARI_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const BULAN_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const HARI_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatDateLong(val, lang = 'en') {
  if(!val) return '—';
  const [y,m,d] = val.split('-').map(Number);
  const dt = new Date(y,m-1,d);
  if (lang === 'id') {
    return `${HARI_ID[dt.getDay()]}, ${d} ${BULAN_ID[m-1]} ${y}`;
  }
  return `${HARI_EN[dt.getDay()]}, ${d} ${BULAN_EN[m-1]} ${y}`;
}
function formatDate(s) {
  if(!s) return '—';
  const [y,m,d] = s.split('-');
  return `${d}-${m}-${y}`;
}
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatProgressHTML(text) {
  if (!text) return '<em style="color:#94a3b8">—</em>';
  let formatted = escHtml(text);
  formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}
function toast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.className = '', 3000);
}


// ============================================================
// UTILITAS SHARED (dipakai Auto tab, Exam tab, PDF builder)
// ============================================================

function getLessonTag(s) {
  if (!s) return '';
  if (s.lesson) {
    if ((s.status === 'double' || s.status === 'one_and_half') && s.lesson2) {
      return `Lesson ${s.lesson} & ${s.lesson2}`;
    }
    return `Lesson ${s.lesson}`;
  }
  const match = (s.progress || '').match(/Lesson\s+(\d+(?:\s*(?:&|and|,)\s*\d+)?)/i);
  return match ? match[0] : '';
}

// ============================================================
// INIT
// ============================================================
const _t = new Date();
const _mm = String(_t.getMonth()+1).padStart(2,'0');
const _dd = String(_t.getDate()).padStart(2,'0');
const todayVal = _t.getFullYear()+'-'+_mm+'-'+_dd;

document.getElementById('auto-tanggal').value = todayVal;

// (tidak ada lagi seed data dummy — sekarang Daily Auto Report jadi landing
// page, guru langsung "Muat Jadwal" atau tambah murid manual dari kosong)
setLang('en');
autoUpdatePreview();
setTimeout(fitPreviewScale, 100);