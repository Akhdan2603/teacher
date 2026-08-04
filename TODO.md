# TODO — Timedoor Report Generator

## 🆕 Fitur Admin Sheets & Absensi (Update Terbaru)

**Tidak perlu setup manual** — 3 tab baru ini **auto-dibuat sendiri** oleh sistem
begitu pertama kali dibutuhkan:
- `Belum Buat Report` — view baca-saja, auto-sync tiap ada perubahan
- `Sudah Buat Report` — view baca-saja, auto-sync tiap ada perubahan
- `Streak Tidak Hadir` — bertambah kolom `Absen 1, Absen 2, ...` otomatis ke kanan tiap siswa absen lagi, ke-reset (kosong lagi) begitu siswa itu submit Daily Report lagi

⚠️ **Jangan edit 2 sheet "Belum/Sudah Buat Report" secara manual** — datanya akan
ditimpa lagi otomatis tiap ada submit baru (sumber kebenaran tetap di tab `Student`).

- [ ] Redeploy Apps Script (New version) — ada file baru `AdminSheets.gs`
- [ ] Tes: submit Daily Report checkpoint baru → cek muncul di `Belum Buat Report`
- [ ] Tes: submit Exam Report / klik "Report Telah Selesai" → cek pindah ke `Sudah Buat Report`
- [ ] Tes: klik "🚫 Tidak Hadir" 2x untuk siswa yang sama → cek `Absen 1` dan `Absen 2` keduanya terisi
- [ ] Tes: submit Daily Report normal untuk siswa yang tadi ditandai absen → cek kolom Absen di `Streak Tidak Hadir` jadi kosong lagi

## 🆕 WAJIB: Setup Gemini AI

- [ ] `GEMINI_API_KEY` di Script Properties (aistudio.google.com/apikey, gratis)
- [ ] Redeploy Apps Script

## 🆕 Reminder Timing (Sudah Diubah)

Reminder pertama 3 hari setelah checkpoint, lalu tiap 3 hari, jam 8 pagi (1 trigger cukup).
- [ ] Kalau sebelumnya sempat pasang 2 trigger untuk mode eskalasi versi lama, hapus salah satunya

## 🔴 Bug "Unknown action: undefined" — Sudah Diperbaiki (GET-based)

Kalau masih muncul, cek:
1. [ ] `js/api.js` sudah versi GET-based
2. [ ] `Code.gs` action mutasi ada di `doGet`
3. [ ] Sudah redeploy (New version, bukan cuma Save)
4. [ ] Hard refresh browser

## 🆕 Skema Kolom Tab `Student` (dari update sebelumnya)

Status Lesson, Selesai, Lesson 8/16/24/32/40/48, Report 8/16/24/32/40/48,
Last Reminder 8/16/24/32/40/48 — semua sudah dijelaskan di update sebelumnya.

## 🆕 Kolom "Email" di Tab `Teacher`

Untuk fitur Calendar invite di tombol "Ingatkan Report".

## 🆕 Course Baru "Tech Explorer"

- [ ] Belum ada mapping di `course-tab-map.js` (masih `null`) — isi kalau sudah ada tab exam template-nya

## 🔴 Data Sumber (Spreadsheet)

- [ ] Perbaiki typo kurung siku: `3D_ANIMATOR!A25`, `WEBSITE_DESIGNER!A25` (JUNIORS)
- [ ] Hapus tab `Sheet6` (KIDS) kalau belum
- [ ] Benahi tab `"ROBLOX CODER "` (TEENS)
- [ ] Isi variasi teks kosong `ROBLOX_EXPLORER` blok 1 & 2 (KIDS)

## 🟡 Catatan Penting

- File `data.js`/`templates.js` yang Anda upload sempat mengandung 11 baris bahasa
  Inggris yang sudah pernah diperbaiki sebelumnya tapi hilang lagi (kemungkinan
  ter-generate ulang dari sumber master yang belum diupdate). Sudah diperbaiki lagi.
  **Kalau update file ini lagi di masa depan, kasih tahu saya supaya saya audit ulang.**

## 🔵 Testing Sebelum Rilis

- [ ] Tes tombol "🤖 Generate dengan AI"
- [ ] Tes reminder 3 hari + streak absensi
- [ ] Tes 2 checkpoint berturut tidak saling menimpa
- [ ] Tes semua 3 tombol baru (Ingatkan Report, Report Telah Selesai, Tidak Hadir)
