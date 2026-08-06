# TODO — Timedoor Report Generator

## 🆕 Fitur Baru: Hapus Kelas & Mode Pindah/Drop + Optimasi Performa

- **Hapus Kelas** (tombol 🗑️ di judul tiap kelas, Kelola Murid) — hapus 1 kelas
  beserta semua muridnya sekaligus, cocok kalau kelas pindah tangan ke guru
  lain. Semua muridnya otomatis diarsipkan ke tab **`Pindah`** (auto-dibuat,
  tidak perlu setup manual).
- **Hapus Murid** sekarang 2 mode (2 tombol per murid):
  - 🗑️ **Drop** — arsip permanen ke tab `Drop`, tidak otomatis balik
  - ↪️ **Pindah Kelas** — arsip ke tab `Pindah`. Kalau nanti ADA GURU MANAPUN
    nambah murid baru dengan **Nama Lengkap PERSIS SAMA**, sistem otomatis
    memulihkan seluruh riwayatnya (course, lesson, semua checkpoint) ke kelas
    baru itu — bukan mulai dari nol lagi.
- **Optimasi performa**: `getClassesForTeacher` (Kelola Murid, baca 7 sheet
  sekaligus) di-cache 60 detik; `getJadwalForTeacher` di-cache 30 detik.
  Cache otomatis dibuang begitu ada perubahan data (add/hapus murid/kelas,
  submit report) — jadi tetap selalu fresh, cuma klik berulang/buka-tutup
  tab jadi jauh lebih cepat. `submitDailyReport` juga dirapikan supaya baca
  tab Student cuma 1x per request (sebelumnya sampai 3x).

- [ ] Redeploy Apps Script (New version) — banyak perubahan di `Code.gs` & `AdminSheets.gs`
- [ ] Tes: hapus 1 murid mode "Pindah" → tambah murid baru nama PERSIS sama di kelas lain → cek riwayatnya (course/lesson/checkpoint) ikut balik
- [ ] Tes: hapus 1 kelas utuh → cek semua muridnya masuk tab `Pindah`
- [ ] Rasakan lagi loading Kelola Murid — harusnya jauh lebih cepat terutama di klik ke-2 dst (efek cache)

## 🚨 MIGRASI BESAR — WAJIB DILAKUKAN MANUAL DI SPREADSHEET

Update kali ini mengubah struktur data secara mendasar. Backend TIDAK bisa
migrasi otomatis (saya tidak punya akses tulis ke spreadsheet Anda), jadi
tolong lakukan manual sesuai urutan berikut:

### 1. Pecah tab `Jadwal` jadi 7 tab per hari

Buat 7 tab baru dengan nama PERSIS: `Senin`, `Selasa`, `Rabu`, `Kamis`,
`Jumat`, `Sabtu`, `Minggu`. Masing-masing header:
```
Teacher | Kelas | Nama Lengkap | Nama Panggilan
```
Pindahkan data dari `Jadwal` lama ke tab hari yang sesuai (baris dengan
`Hari = Selasa` masuk ke tab `Selasa`, dst). Setelah semua dipindah, tab
`Jadwal` lama boleh dihapus atau dibiarkan (tidak dipakai lagi oleh sistem).

### 2. Restrukturisasi tab `Student`

Header baru (urutan bebas asal namanya persis, sistem baca berdasarkan nama
kolom bukan posisi):
```
Hari | Kelas | Teacher | Nama Lengkap | Nama Panggilan | Criteria | Course |
Lesson sekarang | Status Lesson | Selesai |
Lesson 8 | Report 8 | Last Reminder 8 |
Lesson 16 | Report 16 | Last Reminder 16 |
Lesson 24 | Report 24 | Last Reminder 24 |
Lesson 32 | Report 32 | Last Reminder 32 |
Lesson 40 | Report 40 | Last Reminder 40 |
Lesson 48 | Report 48 | Last Reminder 48
```
- Kolom **"Student"** lama → pecah jadi **"Nama Lengkap"** (kunci pencocokan,
  harus unik) + **"Nama Panggilan"** (dipakai di teks laporan)
- Tambah kolom **"Teacher"** (isi manual per baris, samakan dengan tab hari terkait)
- Kolom checkpoint (Lesson X/Report X/Last Reminder X) — data lama tetap
  kepakai kalau nama headernya sudah sesuai pola ini

### 3. Tab `Drop` — TIDAK perlu dibuat manual

Auto-dibuat sistem begitu ada murid pertama yang dihapus lewat "Kelola Murid".

### 4. Redeploy Apps Script

Deploy → Manage deployments → ✏️ → Version: **New version** → Deploy.
`Code.gs` ditulis ulang total, `AdminSheets.gs` juga banyak berubah.

---

## 🆕 Fitur Baru Kali Ini

- **Landing page** = Daily Auto Report (bukan Manual lagi) setelah login
- **Tab Kelola Murid** (urutan: Auto → Manual → Exam → Kelola Murid) — lihat
  semua kelas guru dikelompokkan per hari dalam 1 layar, tambah/hapus murid
  langsung dari situ (hapus = arsip ke tab `Drop`, bukan hilang permanen)
- **Foto unlimited** — tombol "+ Add Photo" dashed border (gaya sama untuk
  Manual & Auto tab), bisa upload berapa pun, ditampilkan tanpa stretch
  (pakai `object-fit: contain`, foto proporsional dengan letterbox kalau
  rasio tidak pas kotak)

## 🆕 Setup Gemini AI

- [ ] `GEMINI_API_KEY` di Script Properties
- [ ] Redeploy Apps Script

## 🆕 Reminder Timing

Reminder pertama 3 hari setelah checkpoint, lalu tiap 3 hari, jam 8 pagi (1 trigger cukup).

## 🆕 Kolom "Email" di Tab `Teacher`

Untuk fitur Calendar invite di tombol "Ingatkan Report".

## 🆕 Course Baru "Tech Explorer"

- [ ] Belum ada mapping di `course-tab-map.js` (masih `null`)

## 🔴 Data Sumber (Spreadsheet Exam Template)

- [ ] Perbaiki typo kurung siku: `3D_ANIMATOR!A25`, `WEBSITE_DESIGNER!A25` (JUNIORS)
- [ ] Hapus tab `Sheet6` (KIDS) kalau belum
- [ ] Benahi tab `"ROBLOX CODER "` (TEENS)
- [ ] Isi variasi teks kosong `ROBLOX_EXPLORER` blok 1 & 2 (KIDS)

## 🔵 Testing Sebelum Rilis (urutan disarankan)

1. [ ] Selesaikan migrasi spreadsheet (bagian paling atas) DULU sebelum tes apa pun
2. [ ] Redeploy Apps Script
3. [ ] Tes login → harus langsung landing di Daily Auto Report
4. [ ] Tes tab Kelola Murid: lihat semua kelas → tambah murid baru → hapus murid → cek masuk tab `Drop`
5. [ ] Tes Daily Report dengan murid yang baru ditambah lewat Kelola Murid
6. [ ] Tes upload 3-5 foto sekaligus → cek tidak stretch, layout grid rapi
7. [ ] Tes semua tombol checkpoint (Ingatkan Report, Report Selesai, Tidak Hadir)
8. [ ] Tes Exam Report (manual & AI) dengan siswa baru
