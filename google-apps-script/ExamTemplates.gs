/**
 * ============================================================
 * EXAM TEMPLATE PARSER
 * ============================================================
 * Membaca teks "VARIASI" dari 3 spreadsheet (Junior/Kids/Teens)
 * berdasarkan KEYWORD, bukan posisi baris tetap — karena format
 * asli tiap course/guru sedikit berbeda-beda (lihat catatan di
 * bawah). Ini membuat parser tahan terhadap variasi kecil, tapi
 * TETAP BISA gagal kalau ada label section yang benar-benar baru
 * (di luar alias yang sudah didaftarkan). Kalau itu terjadi,
 * fungsi ini akan return kosong untuk section itu — bukan error
 * fatal — supaya guru tetap bisa lanjut isi manual di form.
 *
 * Kalau nanti ketemu course baru dengan label section yang beda
 * lagi dari yang sudah ada, tinggal tambahkan ke SECTION_ALIASES
 * di bawah.
 * ============================================================
 */

const SECTION_ALIASES = {
  literacy: ['coding literacy and concept', 'coding concept', 'coding literacy'],
  application: ['coding practice', 'coding application'],
  character: ['character'],
};

const GRADE_TO_QUALITY = {
  A: 0, // pilihan pertama di dalam kurung [opsi1/opsi2/opsi3]
  B: 1,
  C: 2,
};

/**
 * Entry point utama: ambil semua varian teks untuk 1 course, 1 blok
 * ujian (lessonNumber/8), untuk 3 kategori penilaian sekaligus.
 *
 * @param {string} criteria  'Junior' | 'Kids' | 'Teens'
 * @param {string} courseTab nama tab/sheet course, HARUS persis sama
 *                           dengan nama tab di spreadsheet (case-sensitive
 *                           di Google Sheets untuk nama sheet).
 * @param {number} lessonNumber lesson saat trigger (misal 8, 16, 24...)
 * @param {string} studentName  nama murid, untuk isi placeholder
 * @param {Object} grades       { literacy: 'A', application: 'B', character: 'A' }
 */
function getExamTemplateText(criteria, courseTab, lessonNumber, studentName, grades) {
  const config = getConfig_();
  const sheetId = config.examSheetIds[criteria];
  if (!sheetId) {
    return { success: false, error: `Tidak ada spreadsheet terdaftar untuk criteria "${criteria}"` };
  }

  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheetByName(courseTab);
  if (!sheet) {
    return { success: false, error: `Tab course "${courseTab}" tidak ditemukan di spreadsheet ${criteria}` };
  }

  const examBlockNumber = Math.round(lessonNumber / 8); // lesson 8→blok 1, 16→blok 2, dst
  const blockRows = findCourseBlock_(sheet, examBlockNumber);
  if (!blockRows) {
    return { success: false, error: `Blok ujian ke-${examBlockNumber} tidak ditemukan di tab "${courseTab}"` };
  }

  const result = {};
  for (const category of ['literacy', 'application', 'character']) {
    const variants = extractVariantsForCategory_(sheet, blockRows, category);
    const grade = (grades && grades[category]) || 'B'; // default 'baik' kalau tidak diisi
    result[category] = variants.map(text => fillTemplateText_(text, studentName, grade));
  }

  return { success: true, blockNumber: examBlockNumber, texts: result };
}

/**
 * Cari baris awal & akhir blok course tertentu (misal blok ke-2),
 * dengan cara scan kolom A cari judul blok yang match nama course
 * + nomor blok, TIDAK peduli spasi ganda/ekstra (di-normalize dulu).
 */
function findCourseBlock_(sheet, blockNumber) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 1) return null; // tab benar-benar kosong (misal belum diisi)

  const data = sheet.getRange(1, 1, lastRow, 1).getValues();
  const blockStarts = []; // { row, text }

  for (let i = 0; i < data.length; i++) {
    const raw = String(data[i][0] || '').trim();
    if (!raw) continue;
    if (isKnownLabel_(raw)) continue; // skip "NOTES", "VARIASI", section labels
    // baris judul blok = baris yang BUKAN label dikenal, dan diikuti (dalam beberapa
    // baris ke depan) oleh salah satu alias section literacy/application/character
    if (looksLikeBlockTitle_(data, i)) {
      blockStarts.push({ row: i + 1, text: normalizeWhitespace_(raw) });
    }
  }

  if (blockStarts.length < blockNumber) return null;

  const startRow = blockStarts[blockNumber - 1].row;
  const endRow = blockNumber < blockStarts.length ? blockStarts[blockNumber].row - 1 : lastRow;
  return { startRow, endRow };
}

function looksLikeBlockTitle_(columnAValues, rowIndex) {
  // PENTING: cek HANYA baris persis di bawahnya (bukan 1-3 baris ke depan).
  // Window yang lebih longgar terbukti (lewat testing terhadap data asli)
  // salah mendeteksi paragraf teks panjang sebagai judul blok baru, karena
  // 2 baris di bawah paragraf tersebut kadang kebetulan ada label section
  // berikutnya. Semua contoh nyata (3D_ANIMATOR, XPLORER, WEB_DEV) selalu
  // menaruh section literacy PERSIS 1 baris di bawah judul blok, tanpa gap.
  if (rowIndex + 1 >= columnAValues.length) return false;
  const nextVal = normalizeWhitespace_(String(columnAValues[rowIndex + 1][0] || '')).toLowerCase();
  for (const key in SECTION_ALIASES) {
    if (SECTION_ALIASES[key].indexOf(nextVal) !== -1) return true;
  }
  return false;
}

function isKnownLabel_(text) {
  const norm = normalizeWhitespace_(text).toLowerCase();
  if (norm === 'notes') return true;
  if (norm.indexOf('variasi') === 0) return true;
  for (const key in SECTION_ALIASES) {
    if (SECTION_ALIASES[key].indexOf(norm) !== -1) return true;
  }
  return false;
}

/**
 * Di dalam range 1 blok, cari section (literacy/application/character),
 * lalu ambil baris teks tepat di bawah baris "VARIASI 1/2/3".
 */
function extractVariantsForCategory_(sheet, blockRows, category) {
  const numRows = blockRows.endRow - blockRows.startRow + 1;
  const values = sheet.getRange(blockRows.startRow, 1, numRows, 6).getValues();
  const aliases = SECTION_ALIASES[category];

  for (let i = 0; i < values.length; i++) {
    const cellText = normalizeWhitespace_(String(values[i][0] || '')).toLowerCase();
    if (aliases.indexOf(cellText) === -1) continue;

    // ketemu section label. Baris berikutnya harusnya "NOTES", lalu "VARIASI x".
    // Cari baris pertama SETELAH ini yang punya isi tapi BUKAN label dikenal —
    // itulah baris teks variasi.
    for (let j = i + 1; j < values.length; j++) {
      const rowIsLabel = isKnownLabel_(String(values[j][0] || ''));
      const hasContent = values[j].some(v => String(v || '').trim() !== '');
      if (hasContent && !rowIsLabel) {
        return values[j].filter(v => String(v || '').trim() !== '');
      }
      // kalau ketemu section label BARU (bukan NOTES/VARIASI) sebelum nemu teks,
      // berarti section ini memang tidak ada isinya di blok ini
      if (!rowIsLabel && !hasContent) continue;
      if (rowIsLabel && cellText !== 'notes' && normalizeWhitespace_(String(values[j][0])).toLowerCase().indexOf('variasi') !== 0) {
        break;
      }
    }
    return []; // section ada tapi teksnya kosong
  }
  return []; // section tidak ditemukan sama sekali di blok ini (contoh: Character di 3D ANIMATOR blok 2)
}

function normalizeWhitespace_(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

/**
 * Isi placeholder [NAMA_STUDENT]/[STUDENT_NAME] dan pilih opsi kualitas
 * yang sesuai grade dari teks berformat [opsi_A/opsi_B/opsi_C].
 */
function fillTemplateText_(rawText, studentName, grade) {
  let text = String(rawText)
    .replace(/\[NAMA_STUDENT\]/gi, studentName)
    .replace(/\[STUDENT_NAME\]/gi, studentName);

  const qualityIndex = GRADE_TO_QUALITY[grade] !== undefined ? GRADE_TO_QUALITY[grade] : 1;

  // ganti semua pola [opsi1/opsi2/opsi3] dengan opsi sesuai grade
  text = text.replace(/\[([^\[\]]+\/[^\[\]]+)\]/g, (match, group) => {
    const options = group.split('/').map(s => s.trim());
    return options[qualityIndex] || options[options.length - 1];
  });

  // Safety-net: kalau masih ada sisa "[" atau "]" (misal karena typo di
  // spreadsheet sumber — kurung tidak seimbang, sudah pernah ditemukan
  // 2 kasus di tab 3D_ANIMATOR & WEBSITE_DESIGNER), buang saja karakternya
  // supaya minimal tidak tampil mentah ke orang tua murid. Perbaikan yang
  // sesungguhnya tetap harus di spreadsheet sumbernya.
  text = text.replace(/[\[\]]/g, '');

  return text.trim();
}
