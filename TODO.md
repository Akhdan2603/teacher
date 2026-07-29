# TODO — Timedoor Report Generator

Catatan hal-hal yang masih perlu dibereskan sebelum/selama rilis. Centang kalau sudah selesai.

## 🟠 Update Struktur Sheet (untuk fitur Exam Report auto-pull) — BARU

- [ ] Tambah kolom baru **"Criteria"** di tab `Student` — taruh di **kolom F** (setelah "Lesson sekarang")
- [ ] Tambah kolom baru **"Criteria"** di tab `Log_Laporan` — taruh di **kolom I** (setelah "Exam"), untuk arsip
- [ ] Tidak perlu isi manual — kolom ini otomatis terisi begitu guru submit Daily Report berikutnya. Data lama (sebelum kolom ini ada) akan kosong sampai guru submit ulang untuk siswa itu.
- [ ] Redeploy Apps Script (New version) supaya kode backend yang baca/tulis kolom ini aktif

## 🔴 Data Sumber (Spreadsheet)

- [ ] **Perbaiki typo kurung siku** di spreadsheet JUNIORS — 2 sel ini kurang tanda `]` penutup:
  - Tab `3D_ANIMATOR`, sel **A25**
  - Tab `WEBSITE_DESIGNER`, sel **A25**
- [ ] **Hapus tab `Sheet6`** di spreadsheet KIDS (kalau belum)
- [ ] **Benahi tab `"ROBLOX CODER "`** di spreadsheet TEENS — spasi ekstra di nama tab + struktur unik, kasih tahu Claude kalau sudah final untuk dibuatkan parser khusus
- [ ] **Isi variasi teks yang masih kosong** di tab `ROBLOX_EXPLORER` (KIDS) — blok 1 & 2

## 🟡 Konfigurasi Mapping Course

- [x] `js/course-tab-map.js` — sudah dilengkapi & diperbaiki strukturnya
- [ ] `"JavaScript Developer"` (Teens) masih `null` — belum ada tab yang cocok, isi kalau sudah ada

## 🟢 Setup Infrastruktur (Google Apps Script)

- [ ] Deploy `google-apps-script/Code.gs` + `ExamTemplates.gs` sebagai 1 project Apps Script
- [ ] Isi 6 **Script Properties**: `TELEGRAM_TOKEN`, `MAIN_SHEET_ID`, `JUNIOR_SHEET_ID`, `KIDS_SHEET_ID`, `TEENS_SHEET_ID`, `ADMIN_CHAT_ID`
- [ ] Deploy sebagai **Web App** (Execute as: Me, Access: Anyone) → copy URL
- [ ] Ganti `GAS_URL` di `js/api.js` dengan URL Web App hasil deploy (URL POLOS, jangan tambahkan `?action=...`)
- [ ] Buat **Time-driven Trigger** untuk `cronReminderKelipatan8`
- [ ] Isi kolom **Chat ID Telegram** di tab `Teacher` untuk tiap guru
- [ ] Isi **Chat ID admin** di Script Properties (`ADMIN_CHAT_ID`)
- [ ] **PIN wajib unik antar semua guru** (login sekarang PIN-only, tanpa pilih nama) — pastikan tidak ada 2 guru pakai PIN yang sama

## 🔵 Testing Sebelum Rilis

- [ ] Tes login PIN-only dengan minimal 2 guru berbeda (PIN harus unik)
- [ ] Tes generate daily report bahasa Indonesia untuk course yang tadinya bermasalah (AI Machine Learning, Python Game Developer, dll)
- [ ] Tes upload 1 foto → cek layout PDF/preview jadi full-width, bukan 2 kotak
- [ ] Tes upload 0 foto (khusus Exam Report) → cek section foto hilang total
- [ ] Tes trigger kelipatan-8 → cek notifikasi Telegram terkirim & `Sheet5` terupdate
- [ ] Tes tab Exam Report: pilih siswa dari pending list → cek Criteria & Course otomatis terisi
- [ ] Tes di HP Android & iOS (khususnya upload foto)
