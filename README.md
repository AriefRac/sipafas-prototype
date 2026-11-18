# SIPAFAS — Prototype

Prototype web **Sistem Informasi Pelaporan Fasilitas** (sisi mahasiswa pelapor) untuk pengujian UAT dan kuesioner usability. Tanpa backend, database, atau autentikasi sungguhan. Spesifikasi lengkap ada di [docs/PRD.md](docs/PRD.md).

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`). Masuk dengan NIM dan kata sandi apa saja.

> Setiap kali tombol **Masuk** ditekan, data laporan dikembalikan ke data awal (seed) supaya tiap responden mulai dari kondisi yang sama. Pilihan tema terang/gelap tidak ikut direset.

## Build

```bash
npm run build
```

Hasil build statis ada di folder `dist/`. Untuk mencoba hasil build secara lokal: `npm run preview`.

## Deploy ke GitHub Pages

Proyek memakai `HashRouter` dan `base: './'`, jadi tidak perlu konfigurasi server.

**Cara 1 — paket `gh-pages`**

```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

Lalu di GitHub: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.

**Cara 2 — manual**

Jalankan `npm run build`, lalu unggah isi folder `dist/` ke branch yang dipakai GitHub Pages.

## Struktur folder

```
src/
├─ components/   Button, Card, StatusChip, Dialog, navigasi, animasi
├─ context/      ReportContext (data laporan), ThemeContext (tema)
├─ data/         seed.js (data awal)
├─ lib/          helper kecil (cn, format tanggal)
└─ pages/        Masuk, Beranda, Buat Laporan, Riwayat, Detail, Profil
```

## Catatan teknis

- Stack: React 18 + Vite, Tailwind CSS, lucide-react, react-router-dom (HashRouter), `motion` (skeleton shimmer dan animasi centang), `@fontsource-variable/inter` (font).
- Transisi wipe skeleton memakai View Transitions API langsung, karena `AnimateView` dari `motion` membutuhkan React 19.3. Di browser yang belum mendukungnya, konten langsung tampil tanpa wipe.
- Semua animasi menghormati pengaturan *reduce motion* di perangkat.
- Foto gedung di halaman Masuk dipakai dalam dua ukuran: `src/assets/gedung-fakultas-1100.webp` (HP) dan `gedung-fakultas-1672.webp` (laptop). File `gedung-fakultas.webp` adalah foto asli (tidak ikut di-build). Jika mengganti foto, buat ulang kedua versi tersebut dengan nama yang sama.

## Optimasi pemuatan

- **Kode dipecah per halaman** (`React.lazy`): saat dibuka, browser hanya mengunduh inti aplikasi + halaman yang sedang tampil. Halaman lain diunduh diam-diam saat browser senggang, jadi perpindahan halaman tetap cepat.
- **Library animasi `motion`** hanya dimuat di halaman yang memakainya (Beranda, Riwayat, Detail, Buat Laporan), dan memakai `LazyMotion` + `m` agar lebih kecil. Halaman Masuk tidak memuatnya.
- **Foto login** dikompres dan dipilih sesuai layar lewat `<picture>`: HP ±85 KB, laptop ±160 KB (asli 324 KB). Tiap perangkat hanya mengunduh satu versi.
- **Font Inter disimpan sendiri** (paket `@fontsource-variable/inter`, satu file Latin ±48 KB), tanpa permintaan ke Google Fonts.
- Efek yang berat untuk HP dihindari: tanpa `backdrop-blur` di header dan tanpa filter `blur` di banner.
