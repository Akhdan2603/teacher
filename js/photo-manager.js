// ============================================================
// PHOTO MANAGER — upload foto dinamis (unlimited, tidak stretch)
// Dipakai Auto tab. Depends on: app.js (fitPreviewScale, toast)
// ============================================================

let autoPhotoData = [];

function handlePhotoAdd(e, isAuto) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  const arr = autoPhotoData;
  let remaining = files.length;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      arr.push(ev.target.result);
      remaining--;
      if (remaining === 0) {
        renderPhotoGrid();
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  });
}

function removePhotoAt(isAuto, index) {
  autoPhotoData.splice(index, 1);
  renderPhotoGrid();
  toast('Photo removed', 'success');
}

function renderPhotoGrid() {
  const arr = autoPhotoData;
  const gridIds = ['auto-photo-grid-input', 'auto-photo-grid'];
  const section = document.getElementById('auto-photo-section');

  const thumbHtml = arr.map((src, i) => `
    <div class="photo-thumb-wrap">
      <img src="${src}" alt="Photo ${i + 1}">
      <button type="button" class="btn-photo-overlay-del" data-html2canvas-ignore="true" onclick="removePhotoAt(true, ${i})" title="Remove Photo">✕</button>
    </div>`).join('');

  gridIds.forEach(id => {
    const grid = document.getElementById(id);
    if (grid) grid.innerHTML = thumbHtml;
  });

  if (section) section.style.display = arr.length === 0 ? 'none' : '';
  fitPreviewScale();
}

