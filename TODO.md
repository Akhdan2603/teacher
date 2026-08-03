# TODO — Timedoor Report Generator

## 🆕 WAJIB: Skema Kolom Baru di Tab `Student` (Sistem Checkpoint)

Bug lama (Sheet5 cuma simpan 1 checkpoint terakhir, jadi checkpoint sebelumnya
ketimpa) sudah diperbaiki dengan pindah tracking ke tab `Student`, per-checkpoint
punya kolom sendiri supaya tidak saling menimpa. Header **harus persis** ini
(toleran spasi ekstra/huruf besar-kecil, tapi kata-katanya harus sama):

| Kolom | Isi |
|---|---|
| Hari, Kelas, Student, Course, Lesson sekarang, Criteria | *(sudah ada)* |
| **Status Lesson** | BARU — auto-terisi "Completed"/"On Going" tiap submit Daily Report |
| **Selesai** | *(sudah Anda buat)* — TRUE manual kalau course ini sudah tuntas total |
| **Lesson 8** | timestamp otomatis saat lesson 8 pertama kali tercapai (kosong = belum) |
| **Report 8** | TRUE/FALSE — exam report utk checkpoint 8 sudah dibuat |
| **Last Reminder 8** | *(sudah Anda buat)* — timestamp reminder terakhir utk checkpoint 8 |
| ... pola yang sama untuk **16, 24, 32, 40, 48** | (total 6×3 = 18 kolom checkpoint) |

- [ ] Tambah kolom **Status Lesson** (belum pernah dibuat sebelumnya)
- [ ] Tambah kolom **Lesson 8/16/24/32/40/48** (timestamp, biarkan kosong dulu untuk siswa lama)
- [ ] Tambah kolom **Report 8/16/24/32/40/48** (checkbox TRUE/FALSE, default kosong/FALSE)
- [x] Kolom **Last Reminder 8/16/24/32/40/48** — sudah Anda buat
- [x] Kolom **Selesai** — sudah Anda buat
- [ ] **`Sheet5` (Trigger) sudah TIDAK DIPAKAI LAGI** — boleh dihapus atau dibiarkan saja

## 🆕 WAJIB: Kolom Baru di Tab `Teacher`

- [ ] Tambah kolom **"Email"** (Gmail guru) — dipakai fitur "Ingatkan Report" untuk undang guru ke Google Calendar event. Kalau kosong, Calendar dilewati tapi Telegram tetap terkirim.

## 🆕 Setup Tambahan: Trigger 2x/Hari (mode eskalasi)

Mode eskalasi (>7 hari pending) didesain bisa kirim reminder **2x/hari**, tapi
perlu **2 Time-driven Trigger** untuk `cronReminderKelipatan8` (misal jam 08:00
dan 17:00). Kalau cuma 1 trigger/hari, reminder eskalasi jadi 1x/hari juga.

- [ ] (Opsional) Tambah trigger ke-2 untuk `cronReminderKelipatan8` di jam berbeda

## 🔴 Data Sumber (Spreadsheet) — dari sebelumnya

- [ ] Perbaiki typo kurung siku: `3D_ANIMATOR!A25`, `WEBSITE_DESIGNER!A25` (JUNIORS)
- [ ] Hapus tab `Sheet6` (KIDS) kalau belum
- [ ] Benahi tab `"ROBLOX CODER "` (TEENS) — spasi ekstra + struktur unik
- [ ] Isi variasi teks kosong di `ROBLOX_EXPLORER` blok 1 & 2 (KIDS)

## 🟡 Konfigurasi Mapping Course

- [x] `js/course-tab-map.js` — sudah dilengkapi & diperbaiki
- [ ] `"JavaScript Developer"` (Teens) masih `null` — isi kalau sudah ada tab yang cocok

## 🟢 Setup Infrastruktur (Google Apps Script)

- [ ] Redeploy Apps Script (New version) — `Code.gs` berubah total di update ini
- [ ] Isi 6 Script Properties (lihat `PANDUAN.md`)
- [ ] `GAS_URL` di `js/api.js` — URL polos, tanpa `?action=...`
- [ ] PIN wajib unik antar semua guru (login sekarang PIN-only)
- [ ] Chat ID Telegram tiap guru + admin

## 🔵 Testing Sebelum Rilis

- [ ] Tes 2 lesson checkpoint berturut (misal 8 lalu 16) → pastikan KEDUANYA tercatat, bukan yang lama ketimpa
- [ ] Tes tombol "Ingatkan Report" → cek Telegram masuk + (kalau email guru terisi) cek undangan Calendar masuk
- [ ] Tes tombol "Report Telah Selesai" → cek kolom Report X yang paling kecil/lama otomatis jadi TRUE
- [ ] Tes submit Exam Report dari tab Exam Report → cek juga menandai Report X yang benar
- [ ] Tes kolom Status Lesson terisi "Completed"/"On Going" sesuai status di form
- [ ] Tes kolom Selesai = TRUE → pastikan siswa itu tidak lagi muncul di reminder/pending manapun
