# 📖 PANDUAN LENGKAP: Timedoor Report Generator

Panduan ini dibagi 4 bagian:
- **Bagian 1** — Setup awal (dilakukan SEKALI saja oleh Anda/admin)
- **Bagian 2** — Cara pakai sehari-hari (untuk guru)
- **Bagian 3** — Cara update data (tambah guru/murid/jadwal baru)
- **Bagian 4** — Cara update kode kalau ada perubahan fitur nanti

---

## 🔧 BAGIAN 1: SETUP AWAL (Sekali Saja)

### Langkah 1.1 — Deploy Backend (Google Apps Script)

1. Buka [script.google.com](https://script.google.com) → **New Project**
2. Buat file `Code.gs` → paste isi dari `google-apps-script/Code.gs`
3. Buat file `ExamTemplates.gs` → paste isi dari `google-apps-script/ExamTemplates.gs`
4. Ikon **gear ⚙️ (Project Settings)** → **Script Properties** → isi 6 baris:

   | Property | Value |
   |---|---|
   | `TELEGRAM_TOKEN` | token dari BotFather |
   | `MAIN_SHEET_ID` | ID spreadsheet "Input data" (lihat cara ambil ID di bawah) |
   | `JUNIOR_SHEET_ID` | ID spreadsheet "JUNIORS report templates" |
   | `KIDS_SHEET_ID` | ID spreadsheet "KIDS report templates" |
   | `TEENS_SHEET_ID` | ID spreadsheet "TEENS report templates" |
   | `ADMIN_CHAT_ID` | Chat ID Telegram Anda |

   **Cara ambil Spreadsheet ID**: dari URL, ambil bagian di antara `/d/` dan `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/1APnqBBrLDhY6.../edit?gid=0#gid=0
                                          └── ini ID-nya ──┘
   ```
   ⚠️ JANGAN ikutkan bagian `/edit?gid=0#gid=0` — itu bukan bagian dari ID.

5. Save (Ctrl+S)

### Langkah 1.2 — Deploy sebagai Web App

1. **Deploy** → **New deployment** → tipe **Web app**
2. **Execute as**: `Me` | **Who has access**: **`Anyone`** ⚠️ WAJIB "Anyone"
3. **Deploy** → Authorize akses (klik akun → Advanced → Go to [project] (unsafe) → Allow)
4. Copy **Web app URL**, contoh: `https://script.google.com/macros/s/AKfycb.../exec`

> ⚠️ Tiap kali edit kode di `Code.gs`/`ExamTemplates.gs`: **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. URL tetap sama, cuma versi kode yang perlu di-update begini.

### Langkah 1.3 — Hubungkan Frontend ke Backend

Buka `js/api.js`, cari baris:
```js
const GAS_URL = 'PASTE_URL_WEB_APP_ANDA_DI_SINI';
```
Ganti jadi URL dari Langkah 1.2 — **URL POLOS SAJA**, jangan tambahkan `?action=...` apapun di belakangnya:
```js
const GAS_URL = 'https://script.google.com/macros/s/AKfycb..../exec';
```

### Langkah 1.4 — Setup Bot Telegram (Chat ID)

1. Guru/Anda buka bot Telegram → klik **Start**
2. Buka di browser: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Cari angka di `"chat":{"id": ...}` — itu Chat ID
4. Masukkan ke kolom **"Chat ID tele"** di tab `Teacher` (untuk guru), atau ke `ADMIN_CHAT_ID` (untuk admin)

### Langkah 1.5 — Buat Cron Trigger (Reminder Otomatis)

Ikon **jam ⏰ (Triggers)** → **+ Add Trigger** → function `cronReminderKelipatan8` → Time-driven → Day timer → jam berapa saja → Save

### Langkah 1.6 — Upload/Deploy Frontend

**Opsi A — Vercel**: push ke GitHub → vercel.com → Add New Project → pilih repo → Deploy
**Opsi B — GitHub Pages**: push ke GitHub → Settings → Pages → Source: main branch → Save

Bagikan URL yang muncul ke semua guru.

---

## 👩‍🏫 BAGIAN 2: CARA PAKAI SEHARI-HARI (untuk Guru)

### 2.1 Login (PIN-only)
1. Buka link web app
2. Masukkan **PIN 4 digit** → **Masuk** (tidak perlu pilih nama — sistem otomatis kenali dari PIN)
3. Nama guru muncul di pojok kanan atas setelah masuk. Sekali login, tidak perlu login lagi di device yang sama (kecuali klik "Ganti Guru")
4. ⚠️ **PIN harus unik** — kalau 2 guru pakai PIN yang sama, sistem tidak akan tahu itu siapa dan akan menolak login dengan pesan error

### 2.2 Membuat Daily Report
1. Tab **⚡ Daily Auto Report** → pilih **Hari** → **⚡ Muat Murid Otomatis**
2. Per murid: pilih Criteria → Course → Lesson → isi progress → **Generate** (otomatis tersimpan ke sistem)
3. Upload foto (0, 1, atau 2 foto — layout otomatis menyesuaikan jumlahnya)
4. **Send to WhatsApp** / **Export PDF**
5. Kalau lesson yang dipilih persis checkpoint (8/16/24/32/40/48), sistem otomatis catat & kirim reminder pertama ke Telegram guru
6. Dua tombol tambahan di tiap kartu murid:
   - **⏰ Ingatkan Report** — klik untuk langsung kirim reminder manual sekarang juga (Google Calendar invite ke email guru + Telegram double-check), tidak perlu nunggu cron harian
   - **✅ Report Telah Selesai** — klik untuk langsung tandai checkpoint pending TERLAMA sebagai selesai, tanpa harus lewat tab Exam Report (berguna kalau laporannya sudah dibuat di luar sistem)

### 2.3 Membuat Exam Report
1. Tab **🎓 Exam Report** → pilih siswa dari daftar pending (atau isi manual)
2. **Criteria & Course otomatis terisi** dari data Daily Report terakhir siswa itu — tapi tetap bisa diubah manual kalau perlu
3. Pilih grade (A/B/C) → **🪄 Ambil Template dari Sistem** → edit teks bila perlu
4. **💾 Simpan ke Sistem** → Export PDF / Send WA

---

## 🗂️ BAGIAN 3: CARA UPDATE DATA

Semua dilakukan langsung di Google Sheets "Input data" — tidak perlu sentuh kode.

### 3.1 Tambah Guru Baru
Tab `Teacher`: `Name | PIN (wajib unik!) | Chat ID tele | status (TRUE)`

### 3.2 Tambah/Ubah Jadwal
Tab `Jadwal`: 1 baris per kombinasi `Teacher | Hari | Kelas | Student`

### 3.3 Tambah/Ubah Murid
Tab `Student`: `Hari | Kelas | Student | Course (kosong) | Lesson sekarang (kosong) | Criteria (kosong)`

Tambahkan baris yang sama juga di `Log_Laporan`: `Teacher | Hari | Kelas | Student | Course | Lesson sekarang | Daily | Exam | Criteria` (semua kosong kecuali Teacher/Hari/Kelas/Student).

> ⚠️ Kombinasi **Hari+Kelas+Student** harus SAMA PERSIS di semua tab.

### 3.4 Tambah Course Baru
1. Tambah di `COURSE_MAP` (`js/data.js`)
2. Tambah mapping tab-nya di `js/course-tab-map.js`
3. Tambah template daily report di `js/templates.js` kalau perlu (ikuti pola yang sudah ada, tulis dalam Bahasa Indonesia untuk `TEMPLATES`, Inggris untuk `TEMPLATES_EN`)

### 3.5 Reset PIN / Nonaktifkan Guru
Ubah kolom PIN atau `status` (TRUE→FALSE) di tab `Teacher`.

---

## 💻 BAGIAN 4: CARA UPDATE KODE

**Frontend**: edit file → push GitHub → Vercel/Pages auto-redeploy
**Backend**: edit `Code.gs`/`ExamTemplates.gs` → **WAJIB** Deploy → Manage deployments → New version → Deploy

---

## 🆘 TROUBLESHOOTING CEPAT

| Gejala | Penyebab | Solusi |
|---|---|---|
| Gagal memuat / tidak bisa login | `GAS_URL` salah/placeholder, atau ada `?action=...` ikut ke dalam `GAS_URL` | Cek Langkah 1.3 — URL harus polos |
| Login bilang "PIN terdaftar untuk lebih dari 1 guru" | 2 guru pakai PIN sama | Ubah salah satu PIN di tab `Teacher` |
| Deployment "Anyone" tapi tetap gagal | Lupa buat versi baru setelah edit kode | Manage deployments → New version |
| Notifikasi Telegram tidak terkirim | Chat ID kosong/salah | Cek Langkah 1.4 |
| Criteria & Course Exam Report tidak auto-fill | Kolom "Criteria" belum ditambahkan di tab `Student`, atau siswa belum pernah Daily Report | Tambah kolom (lihat TODO.md), atau isi manual |
| Tombol "Ambil Template dari Sistem" tidak jalan untuk course tertentu | Course itu belum ada di `course-tab-map.js` | Lihat TODO.md |
| Checkpoint lesson 8 "hilang" setelah lanjut ke lesson 16 | Versi lama (Sheet5) cuma simpan 1 checkpoint terakhir — sudah diperbaiki, pastikan pakai `Code.gs` versi terbaru + kolom `Lesson 8/16/24/...` sudah ditambahkan di tab `Student` | Redeploy Apps Script versi baru |
| Tombol "Ingatkan Report" gagal bikin Calendar event | Kolom "Email" di tab `Teacher` kosong/belum ada | Tambah kolom Email, isi Gmail guru. Telegram tetap terkirim walau Calendar gagal |
| Reminder eskalasi (>7 hari) cuma kirim 1x/hari padahal maunya 2x | Cuma ada 1 Time-driven Trigger | Tambah trigger ke-2 di jam berbeda untuk fungsi yang sama |
