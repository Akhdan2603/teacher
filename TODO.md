# TODO — Timedoor Report Generator

## 🆕 WAJIB: Setup Gemini AI (fitur "Generate dengan AI" di Exam Report)

- [ ] Buka [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → buat API key (gratis, tanpa kartu kredit)
- [ ] Tambah Script Property baru: `GEMINI_API_KEY` = key tadi
- [ ] Redeploy Apps Script (New version)
- [ ] Kalau API key belum diisi / gagal / limit habis → otomatis fallback ke sistem VARIASI manual, TIDAK error fatal

## 🆕 PERUBAHAN: Reminder Timing (Bug Perbaikan + Desain Baru)

Desain reminder diubah total:
- **Sebelum**: notifikasi langsung begitu checkpoint (lesson 8/16/dst) terdeteksi, lalu reminder harian, eskalasi 2x/hari setelah 7 hari
- **Sekarang**: TIDAK ada notifikasi langsung. Reminder PERTAMA dikirim **3 hari setelah** checkpoint tercapai, lalu diulang **tiap 3 hari sekali** selama masih pending. Semua reminder terjadwal lewat 1 cron **jam 8 pagi**.

- [ ] **Redeploy Apps Script** — `cronReminderKelipatan8` sudah ditulis ulang total
- [ ] Kalau sebelumnya Anda sempat pasang **2 trigger** (untuk mode eskalasi 2x/hari versi lama), **hapus salah satunya** — sekarang cukup **1 trigger, jam 08:00 pagi saja**
- [ ] Tombol manual "⏰ Ingatkan Report" TETAP kirim reminder instan kapan saja (tidak terikat jadwal 3 hari ini — itu untuk kasus guru mau reminder di luar jadwal otomatis)

## 🔴 Bug "Unknown action: undefined" — Redeploy Checklist

Kalau masih muncul setelah update kemarin, cek urutan ini:
1. [ ] `js/api.js` — pastikan `apiPost` sudah versi GET-based (cek ada komentar "PENTING: fungsi ini bernama apiPost...")
2. [ ] `Code.gs` — pastikan action mutasi (`submitDailyReport`, dst) ada di `doGet`, bukan cuma di `doPost`
3. [ ] Deploy → Manage deployments → ✏️ → Version: **New version** → Deploy (BUKAN cuma Save)
4. [ ] Hard refresh browser (Ctrl+Shift+R)
5. [ ] Kalau MASIH error persis sama setelah 4 langkah ini beneran dilakukan, kasih tahu saya — berarti ada penyebab lain yang perlu digali lebih dalam

## 🆕 WAJIB (dari update sebelumnya): Skema Kolom Tab `Student`

| Kolom | Isi |
|---|---|
| Status Lesson | auto: "Completed"/"On Going" |
| Selesai | manual TRUE/FALSE — course tuntas total |
| Lesson 8/16/24/32/40/48 | timestamp otomatis saat checkpoint tercapai |
| Report 8/16/24/32/40/48 | TRUE/FALSE — exam report checkpoint itu sudah dibuat |
| Last Reminder 8/16/24/32/40/48 | timestamp reminder terakhir per checkpoint |

## 🆕 WAJIB: Kolom "Email" di Tab `Teacher`

Untuk fitur Calendar invite di tombol "Ingatkan Report".

## 🔴 Data Sumber (Spreadsheet) — dari sebelumnya

- [ ] Perbaiki typo kurung siku: `3D_ANIMATOR!A25`, `WEBSITE_DESIGNER!A25` (JUNIORS)
- [ ] Hapus tab `Sheet6` (KIDS) kalau belum
- [ ] Benahi tab `"ROBLOX CODER "` (TEENS)
- [ ] Isi variasi teks kosong `ROBLOX_EXPLORER` blok 1 & 2 (KIDS)

## 🟡 Belum Terjawab

- [ ] Maksud "copas jadi table" — masih perlu klarifikasi dari Anda

## 🔵 Testing Sebelum Rilis

- [ ] Tes tombol "🤖 Generate dengan AI" — cek hasil teks masuk akal & sesuai objective course
- [ ] Tes AI gagal (misal matikan sementara API key) → pastikan fallback ke manual jalan otomatis
- [ ] Tes reminder: checkpoint baru tercapai → JANGAN ada notif hari itu juga → cek muncul setelah 3 hari
- [ ] Tes 2 checkpoint berturut (8 lalu 16) tidak saling menimpa
- [ ] Tes tombol "Ingatkan Report" & "Report Telah Selesai"
