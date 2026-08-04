/**
 * ============================================================
 * AI EXAM TEXT GENERATOR (Google Gemini — Google AI Studio, free tier)
 * ============================================================
 * PENTING: file ini SAMA SEKALI TIDAK mengakses SpreadsheetApp —
 * tidak ada ketergantungan spreadsheet sedikit pun. Materi lesson
 * (objective + contoh narasi) dikirim dari FRONTEND, diambil murni
 * dari js/data.js (COURSE_DATA) dan js/templates.js (TEMPLATES) —
 * dua file lokal di repo, bukan dari Google Sheets. AI merangkai
 * ulang materi itu jadi ringkasan Exam Report yang lebih variatif,
 * BUKAN mengarang bebas.
 *
 * Kalau API gagal/quota habis/key belum diisi, caller (exam.js)
 * TIDAK auto-fallback ke sistem spreadsheet — cukup tampilkan error,
 * guru bisa pilih pakai tombol "Ambil Template dari Sistem" sendiri
 * kalau mau (itu jalur terpisah yang memang spreadsheet-based).
 *
 * SETUP: tambahkan Script Property GEMINI_API_KEY (dari
 * aistudio.google.com/apikey — gratis, tidak perlu kartu kredit).
 *
 * Catatan: nama model Gemini sering berubah. Per Agustus 2026,
 * "gemini-2.5-flash" adalah pilihan free-tier yang stabil. Kalau
 * suatu saat Google pensiunkan model ini, tinggal ganti MODEL_NAME
 * di bawah.
 * ============================================================
 */

const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

/**
 * @param {string} courseName   nama course (buat konteks di prompt)
 * @param {number} checkpoint   8/16/24/32/40/48
 * @param {string} studentName  nama murid
 * @param {Array}  objectives   [{lesson: 1, title: '...', objectives: ['...','...']}, ...]
 * @param {Object} grades       { literacy: 'A', application: 'B', character: 'A' }
 */
function generateAIExamTexts(courseName, checkpoint, studentName, objectives, grades) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return { success: false, error: 'GEMINI_API_KEY belum diisi di Script Properties.' };
  }
  if (!objectives || objectives.length === 0) {
    return { success: false, error: 'Daftar objective kosong — tidak ada bahan untuk AI.' };
  }

  const objectiveListText = objectives.map(l => {
    const objText = (l.objectives || []).join('; ');
    const lines = [`Lesson ${l.lesson}${l.title ? ' - ' + l.title : ''}: ${objText}`];
    if (l.templateText) lines.push(`  (Contoh narasi lesson ini: "${l.templateText}")`);
    return lines.join('\n');
  }).join('\n');

  const qualityWord = { A: 'sangat baik', B: 'baik', C: 'cukup baik' };
  const gradeLiteracy = qualityWord[grades.literacy] || 'baik';
  const gradeApplication = qualityWord[grades.application] || 'baik';
  const gradeCharacter = qualityWord[grades.character] || 'baik';

  const prompt = `Anda adalah asisten guru coding yang menulis laporan ujian (Exam Report) untuk orang tua murid bernama "${studentName}" di course "${courseName}".

DAFTAR MATERI YANG SUDAH DIPELAJARI (Lesson 1 sampai ${checkpoint}) — INI SATU-SATUNYA SUMBER FAKTA YANG BOLEH ANDA PAKAI. Setiap lesson disertai contoh narasi yang sudah pernah ditulis guru untuk laporan harian — pakai ini sebagai BAHAN dan GAYA BAHASA acuan, tapi rangkai ULANG jadi ringkasan gabungan lesson 1-${checkpoint} (bukan sekadar menyalin atau menempel satu-satu):
${objectiveListText}

ATURAN KETAT (WAJIB DIPATUHI):
1. HANYA boleh merujuk topik/skill yang PERSIS ada di daftar di atas. DILARANG KERAS menyebutkan tools, bahasa pemrograman, atau project yang TIDAK ada di daftar.
2. Tulis dalam Bahasa Indonesia, nada hangat dan positif untuk orang tua (gaya: "Halo Parents 😊 ...").
3. JANGAN sebutkan angka lesson secara eksplisit (misal jangan tulis "Lesson 3"), cukup deskripsikan materinya secara naratif.
4. Buat kalimat yang RINGKAS (2-4 kalimat per kategori), gabungkan beberapa lesson jadi satu narasi mengalir — jangan daftar per-lesson berurutan seperti list.
5. Ganti-ganti pilihan kata & struktur kalimat tiap kali diminta (untuk keperluan variasi, jangan selalu pakai kalimat yang sama persis dengan contoh narasi di atas).

Buat 3 bagian penilaian:
- "literacy": tentang pemahaman konsep coding (level pencapaian: ${gradeLiteracy})
- "application": tentang penerapan praktik coding dari materi di atas (level pencapaian: ${gradeApplication})
- "character": komentar sikap/karakter di kelas — GENERIK saja (rajin, aktif, kerja sama, dsb — JANGAN mengarang kejadian spesifik), level: ${gradeCharacter}

Jawab HANYA dalam format JSON persis seperti ini, tanpa markdown fence, tanpa teks lain:
{"literacy": "...", "application": "...", "character": "..."}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      responseMimeType: 'application/json',
    },
  };

  try {
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    });

    const statusCode = res.getResponseCode();
    if (statusCode !== 200) {
      return { success: false, error: `Gemini API error (HTTP ${statusCode}): ${res.getContentText().slice(0, 200)}` };
    }

    const data = JSON.parse(res.getContentText());
    const rawText = data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text;
    if (!rawText) {
      return { success: false, error: 'Respons Gemini kosong/tidak terduga.' };
    }

    const parsed = JSON.parse(rawText); // sudah dijamin JSON murni via responseMimeType
    if (!parsed.literacy || !parsed.application || !parsed.character) {
      return { success: false, error: 'Respons AI tidak lengkap (ada bagian kosong).' };
    }

    return {
      success: true,
      texts: {
        literacy: [parsed.literacy],
        application: [parsed.application],
        character: [parsed.character],
      },
    };
  } catch (err) {
    return { success: false, error: 'Gagal memanggil Gemini API: ' + err.message };
  }
}
