# TODO — Timedoor Report Generator

## 🚨 BUG PRIORITAS — SUDAH DIPERBAIKI

**Murid baru dari Kelola Murid gagal submit laporan** ("tidak dapat input
laporan") — akar masalahnya `Log_Laporan` tidak pernah dapat baris baru saat
murid ditambahkan manual, jadi sistem mencari baris yang memang belum ada.

Diperbaiki 2 lapis:
1. `addStudentAction` sekarang langsung bikin baris `Log_Laporan` kosong saat murid ditambah
2. `updateLogRow_` sekarang **upsert** (auto-bikin baris kalau belum ada) — bukan lagi error. Ini jaring pengaman kalau ada jalur lain (misal pemulihan dari tab Pindah) yang somehow belum bikin baris juga.

- [ ] **Redeploy Apps Script** — WAJIB sebelum bug ini benar-benar hilang di produksi
- [ ] Tes: tambah murid baru via Kelola Murid → langsung coba submit Daily Report tanpa refresh apa pun → pastikan tidak ada lagi alert error

## ✅ Refactor Selesai

**1. Konsolidasi PDF** — `downloadPDF` (Manual, sudah dihapus), `downloadAutoPDF`,
`downloadExamPDF` sekarang semua lewat 1 fungsi generik `downloadReportPDF()`
di `pdf-builder.js`. Tidak ada lagi try/catch/toast/tombol-disable yang
diketik ulang 3x.

**2. `app.js` dipecah jadi 4 file** (dari 1.130 baris jadi terstruktur):
- `app.js` (129 baris) — utilitas inti: format tanggal, toast, escHtml, init
- `photo-manager.js` (52 baris) — upload foto dinamis
- `pdf-builder.js` (167 baris) — capture PNG, generate PDF, `downloadReportPDF`
- `auto-tab.js` (660 baris) — logic Daily Auto Report

Sudah diverifikasi **tidak ada fungsi yang hilang** selama proses split (dicek otomatis, before/after sama persis kecuali 1 fungsi baru).

**3. Tab Manual Report dihapus total** — HTML, semua fungsi terkait
(`renderTable`, `renderInputs`, `addStudent`, `removeStudent`, `buildWAMessage`,
`downloadPDF`, dst), dan referensi di tab-bar. Auto tab sudah lebih lengkap
untuk semua kebutuhan yang sama.

**4. Health Check** — tombol 🩺 baru, muncul di **layar login** (supaya bisa
dicek walau belum/gagal login) DAN di **footer** setelah login. Cek otomatis:
- Semua Script Properties terisi
- Semua tab & kolom wajib ada (Teacher, Student — lengkap sampai checkpoint 48, Log_Laporan, 6 tab hari)
- Spreadsheet Exam Template (Junior/Kids/Teens) bisa dibuka
- Token Telegram valid
- Trigger reminder harian sudah terpasang

- [ ] Redeploy Apps Script (file baru `HealthCheck.gs`)
- [ ] Coba klik Health Check dari layar login SEBELUM masukin PIN — pastikan jalan tanpa perlu login dulu
- [ ] Perbaiki semua yang muncul ❌/⚠️ di hasil check sebelum dipakai live

## 🆕 Dari Update Sebelumnya (masih berlaku)

- [ ] `GEMINI_API_KEY` di Script Properties (fitur AI Generate)
- [ ] Kolom "Email" di tab `Teacher` (fitur Calendar invite)
- [ ] `"JavaScript Developer"` (Teens) masih `null` di `course-tab-map.js`
- [ ] Perbaiki typo kurung siku: `3D_ANIMATOR!A25`, `WEBSITE_DESIGNER!A25` (JUNIORS)

## 🔵 Testing Sebelum Rilis

1. [ ] **Jalankan Health Check dulu** — beresin semua ❌ sebelum lanjut test manual
2. [ ] Tes bug prioritas (tambah murid baru → langsung submit report)
3. [ ] Tes semua PDF (Auto tab & Exam tab) masih ke-generate normal setelah konsolidasi
4. [ ] Tes upload foto masih jalan normal (Auto tab)
5. [ ] Pastikan tidak ada lagi tombol/menu Manual Report di UI
