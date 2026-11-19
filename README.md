# 🐰 Petualangan Kiki si Robot Kelinci (Kiki's AlgoBot)
### Game Edukasi Pengenalan Konsep Algoritma untuk Anak Usia 4–6 Tahun
Dibangun dengan **Next.js**, **React**, dan **Tailwind CSS**.

---

## 🌟 Tentang Game Ini
**Petualangan Kiki si Robot Kelinci** adalah game edukasi interaktif visual yang dirancang khusus untuk anak-anak usia dini (PAUD, TK, dan kelas awal SD) untuk mengenalkan fondasi **Computational Thinking** dan **Algoritma** secara menyenangkan tanpa perlu mengetik kode yang rumit.

Anak-anak diajak memandu Kiki—seekor robot kelinci lucu—melewati kebun buah, melompati semak berduri, menghindari kolam bebek, dan mengumpulkan wortel manis serta bintang emas dengan menyusun kartu petunjuk langkah demi langkah.

---

## 🧠 Konsep Algoritma yang Dikenalkan ke Anak (4–6 Tahun)

1. **👣 Sekuensial (Urutan Langkah):**
   - Komputer dan robot tidak bisa menebak pikiran kita; mereka hanya bergerak jika diberikan instruksi langkah demi langkah yang berurutan (Langkah 1 ➡️ Langkah 2 ➡️ Langkah 3).
2. **🧭 Orientasi Spasial & Arah:**
   - Melatih perspektif arah dari sudut pandang Kiki: `Maju` (⬆️), `Belok Kiri` (↺), `Belok Kanan` (↻), dan `Lompat` (🦘).
3. **🐞 Debugging (Menemukan & Memperbaiki Kesalahan):**
   - Mengajarkan *growth mindset*. Ketika Kiki menabrak batu atau tercebur kolam bebek, Kiki hanya bingung sejenak dan ramah berkata: *"Ayo perbaiki langkahnya!"*. Anak tidak merasa takut gagal, melainkan terbiasa meninjau ulang urutan kodenya.
4. **🔁 Pengulangan (Loop):**
   - Memperkenalkan konsep efisiensi melalui tombol `Ulangi 3x` agar anak memahami bahwa instruksi berulang bisa disederhanakan.
5. **🔑 Kondisi & Prasyarat (Pre-requisite / Condition):**
   - Memahami hubungan sebab-akibat: gerbang istana terkunci dan hanya bisa dilewati setelah Kiki mengambil kunci emas terlebih dahulu.
6. **🥪 Algoritma di Kehidupan Nyata:**
   - Menunjukkan bahwa algoritma bukan hanya tentang robot, melainkan ada di keseharian anak: resep membuat roti selai, urutan sikat gigi, menanam bunga, dan mencuci tangan!

---

## 🎮 3 Mode Permainan Seru

### 1. 🗺️ Mode Petualangan Bertingkat (Levels 1–8)
- **Level 1: Langkah Pertama Kiki! 🥕** — Maju 2 langkah ke wortel lezat (Sekuensial dasar).
- **Level 2: Belok ke Kanan! 🔄** — Maju lalu ubah arah ke kanan.
- **Level 3: Belok Kiri ke Bintang Emas! ⭐** — Memilih arah belok kiri.
- **Level 4: Awas Kolam Bebek! 🦆 (Debugging)** — Mencari rute memutar agar tidak basah.
- **Level 5: Koleksi Lengkap Wortel & Bintang! 🥕⭐** — Misi ganda multi-target.
- **Level 6: Lompat Semak Berduri! 🦘** — Menggunakan aksi baru `Lompat`.
- **Level 7: Kunci Emas & Gerbang Istana! 🗝️🚪** — Mengambil kunci sebelum membuka gerbang.
- **Level 8: Trik Ajaib Ulangi (Loop)! 🔁** — Otomatisasi jalur panjang dengan pengulangan.

### 2. 🥪 Mode Algoritma Sehari-hari (Routine Stories)
Anak diajak menata 4 kartu kegiatan acak menjadi urutan yang benar dari awal sampai akhir:
- **🪥 Algoritma Sikat Gigi**: Oles pasta gigi ➡️ Gosok memutar ➡️ Kumur air ➡️ Senyum bersih!
- **🥪 Algoritma Bikin Roti Selai**: Ambil roti ➡️ Buka toples selai ➡️ Oleskan selai ➡️ Tutup & Nyam!
- **🌸 Algoritma Menanam Bunga**: Gali tanah ➡️ Masukkan benih ➡️ Siram air ➡️ Bunga mekar!
- **🧼 Algoritma Cuci Tangan**: Basahi tangan ➡️ Tuang sabun ➡️ Gosok sela jari ➡️ Bilas & keringkan!

### 3. 🎨 Mode Arena Bebas (Creative Sandbox Level Maker)
- Anak, guru, atau orang tua dapat menggambar peta sendiri: meletakkan wortel, pohon, batu, kolam, dan jalan setapak di petak grid.
- Anak kemudian merancang susunan algoritma sendiri untuk menyelesaikan peta yang telah dibuatnya!

---

## 🎨 Fitur Tampilan Menarik & Ramah Anak

- **Karakter Robot Kelinci Kiki (SVG Animasi):**
  - Telinga robotik dengan aksen pastel pink yang bergoyang.
  - Mata bersinar anime dengan efek berkedip dan ekspresi bahagia (*victory dance*) saat menang.
  - Ekspresi bingung lucu bertanda tanya saat menabrak rintangan.
- **Baki Antrean Kode Visual (Visual Step Sequencer):**
  - Tombol-tombol perintah berukuran besar (*chunky 3D button*) dengan warna kontras (Hijau = Maju, Biru = Kiri, Oranye = Kanan, Ungu = Lompat, Pink = Loop).
  - Sorotan terang (*glowing pulse highlight*) pada kotak perintah yang sedang dijalankan sehingga anak paham hubungan 1:1 antara kode dan gerakan Kiki.
- **Efek Suara Mandiri (Web Audio API Synthesizer):**
  - Efek suara *pop, boing, twirl, spring whoosh, sparkling chime*, dan *victory fanfare* tanpa perlu mengunduh aset audio eksternal!
- **Fitur Suara Narasi (Text-to-Speech Web Speech API):**
  - Membacakan instruksi dan petunjuk dalam Bahasa Indonesia ceria, sangat membantu anak usia 4–5 tahun yang belum lancar membaca.
- **Pesta Konfeti Kemenangan:**
  - Partikel konfeti halus 60fps saat anak berhasil menyelesaikan level.
- **Panduan Edukasi Orang Tua & Guru:**
  - Modal panduan interaktif berisi tips mendampingi anak, 4 pilar *computational thinking*, dan glosarium istilah ramah anak.

---

## 🚀 Cara Menjalankan Proyek

1. Masuk ke direktori proyek:
   ```bash
   cd "d:/myCode/Next js/algo-kids"
   ```

2. Jalankan server lokal:
   ```bash
   npm run dev
   ```

3. Buka di browser:
   ```
   http://localhost:3000
   ```

---

Dibuat dengan penuh kasih untuk menginspirasi generasi cilik programmer dan pemikir kreatif Indonesia! 🇮🇩✨
