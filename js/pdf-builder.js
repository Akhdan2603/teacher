// ============================================================
// PDF BUILDER — capture PNG, generate PDF (dipakai Auto tab & Exam tab)
// Depends on: app.js (formatDate, toast, escHtml, fitPreviewScale)
// ============================================================

async function capturePNG(elementId) {
  const el = document.getElementById(elementId);
  const originalOverflow = el.style.overflow;
  el.style.overflow = 'visible';
  
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        clonedEl.style.transform = 'none';
        clonedEl.style.width = '1000px';
        clonedEl.style.minWidth = '1000px';
        if (clonedEl.parentElement) {
          clonedEl.parentElement.style.height = 'auto';
          clonedEl.parentElement.style.width = '1000px';
          clonedEl.parentElement.style.overflow = 'visible';
        }
      }
    }
  });
  
  el.style.overflow = originalOverflow;
  return canvas;
}

// ============================================================
// AUTO TAB

function getImageDims_(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 4, h: img.naturalHeight || 3 });
    img.onerror = () => resolve({ w: 4, h: 3 });
    img.src = src;
  });
}

async function buildAndSavePDF({kelas, tanggal, photos, students, labels}) {
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
  const G_DARK=[20,83,45],G_MED=[22,163,74],G_LIGHT=[240,253,244],SLATE=[30,41,59],WHITE=[255,255,255],MUTED=[100,116,139];
  doc.setFillColor(...WHITE);doc.rect(0,0,W,H,'F');
  
  // Header card
  doc.setFillColor(...G_DARK);doc.roundedRect(14,12,W-28,26,4,4,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(15);doc.setTextColor(...WHITE);doc.text(labels.title,22,27);
  doc.setFillColor(255,255,255,50);doc.roundedRect((W-50)/2,16,50,18,3,3,'F');
  doc.setFontSize(9);doc.setTextColor(...WHITE);doc.text('Timedoor Academy',W/2,27,{align:'center'});
  doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(240,253,244);doc.text(labels.labelKelas + kelas,W-22,23,{align:'right'});
  doc.text(labels.labelTanggal + tanggal,W-22,30,{align:'right'});
  
  const MARGIN=14,GAP=8;
  const photoSrcs = (photos || []).filter(src => !!src);
  const photoCount = photoSrcs.length;

  let PHOTO_Y=44, photoBlockHeight=0;

  if (photoCount > 0) {
    // Grid dinamis: 1 foto = 1 kolom lebar panorama, 2-4 foto = 2 kolom,
    // >4 foto = 3 kolom. Tiap foto di-fit (bukan di-stretch) di dalam sel-nya
    // — rasio aslinya dijaga, sisa ruang di sel jadi "letterbox" kosong,
    // supaya foto tidak pernah gepeng/melar.
    const cols = photoCount === 1 ? 1 : (photoCount <= 4 ? 2 : 3);
    const rowsCount = Math.ceil(photoCount / cols);
    const cellW = (W - MARGIN * 2 - GAP * (cols - 1)) / cols;
    const cellH = cols === 1 ? Math.round(cellW * (9 / 22)) : 42;

    for (let idx = 0; idx < photoCount; idx++) {
      const row = Math.floor(idx / cols), col = idx % cols;
      const cellX = MARGIN + col * (cellW + GAP);
      const cellY = PHOTO_Y + row * (cellH + GAP);
      const src = photoSrcs[idx];

      doc.setFillColor(248, 250, 252); doc.rect(cellX, cellY, cellW, cellH, 'F'); // background letterbox

      const dims = await getImageDims_(src);
      const scale = Math.min(cellW / dims.w, cellH / dims.h);
      const drawW = dims.w * scale, drawH = dims.h * scale;
      const offX = cellX + (cellW - drawW) / 2, offY = cellY + (cellH - drawH) / 2;
      const fmt = src.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(src, fmt, offX, offY, drawW, drawH);
    }
    photoBlockHeight = rowsCount * cellH + (rowsCount - 1) * GAP;
  }

  const TABLE_X=MARGIN,TABLE_W=W-MARGIN*2,COL_NAME_W=44,COL_LESSON_W=32;
  let rowY = photoCount === 0 ? PHOTO_Y : PHOTO_Y+photoBlockHeight+8;
  const HEADER_H=9;
  doc.setFillColor(...G_DARK);doc.roundedRect(TABLE_X,rowY,TABLE_W,HEADER_H,2,2,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(...WHITE);
  doc.text('STATUS',TABLE_X+4,rowY+6);
  doc.text(labels.colName,TABLE_X+18,rowY+6);
  doc.text('LESSON',TABLE_X+18+COL_NAME_W,rowY+6);
  doc.text(labels.colProgress,TABLE_X+18+COL_NAME_W+COL_LESSON_W,rowY+6);
  rowY+=HEADER_H;
  
  doc.setFont('helvetica','normal');doc.setFontSize(9);
  students.forEach((s,idx)=>{
    if(!s.nama&&!s.progress)return;
    const plainText = (s.progress||'—').replace(/\*/g,'');
    const lines=doc.splitTextToSize(plainText,TABLE_W-COL_NAME_W-COL_LESSON_W-24);
    const cellH=Math.max(12,lines.length*5+8);
    if(rowY+cellH>H-20){doc.addPage();rowY=20;}
    if(idx%2===0){doc.setFillColor(...G_LIGHT);doc.rect(TABLE_X,rowY,TABLE_W,cellH,'F');}
    doc.setDrawColor(226,232,240);doc.setLineWidth(0.2);doc.line(TABLE_X,rowY+cellH,TABLE_X+TABLE_W,rowY+cellH);
    
    // Status dot
    const isDone = s.status === 'done' || s.status === 'double' || !/in progress|working on|belum|absent/i.test(s.progress||'');
    doc.setFillColor(...(isDone ? [22,163,74] : [245,158,11]));
    doc.circle(TABLE_X+8,rowY+7,2.5,'F');
    
    // Student Name
    doc.setFont('helvetica','bold');doc.setTextColor(...G_DARK);
    doc.text(s.nama||'—',TABLE_X+18,rowY+6.5);
    
    // Lesson Pill
    const lessonTag = getLessonTag(s);
    if(lessonTag){
      doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(21,128,61);
      doc.setFillColor(240,253,244);
      doc.roundedRect(TABLE_X+18+COL_NAME_W,rowY+3.5,doc.getTextWidth(lessonTag)+6,5,1.5,1.5,'F');
      doc.text(lessonTag,TABLE_X+21+COL_NAME_W,rowY+7);
      doc.setFontSize(9);
    }
    
    // Progress
    doc.setFont('helvetica','normal');doc.setTextColor(...SLATE);doc.text(lines,TABLE_X+18+COL_NAME_W+COL_LESSON_W,rowY+6.5);
    rowY+=cellH;
  });
  
  const tableStartY = photoCount === 0 ? PHOTO_Y : PHOTO_Y+photoBlockHeight+8;
  doc.setDrawColor(...G_MED);doc.setLineWidth(0.5);
  doc.roundedRect(TABLE_X,tableStartY,TABLE_W,rowY-tableStartY,2,2,'S');
  doc.save(`${labels.fileName.replace(/\s+/g,'_')}.pdf`);
}


// ============================================================
// downloadReportPDF — pembungkus generik supaya Auto tab & Exam tab
// tidak duplikat kode try/catch/toast/tombol-disable (dulu ada
// downloadPDF, downloadAutoPDF, downloadExamPDF yang isinya 90% sama).
// Cukup kirim btnId + data + labels, sisanya sama untuk semua tab.
// ============================================================
async function downloadReportPDF({ btnId, btnDefaultText, kelas, tanggal, photos, students, labels }) {
  const btn = document.getElementById(btnId);
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }
  toast('Creating PDF...');
  try {
    await buildAndSavePDF({ kelas, tanggal, photos, students, labels });
    toast('PDF downloaded!', 'success');
  } catch (err) {
    toast('PDF Error: ' + err.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = btnDefaultText || 'Export PDF'; }
  }
}
