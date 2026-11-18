# PRD — Prototype SIPAFAS (Sistem Informasi Pelaporan Fasilitas)

| | |
|---|---|
| Versi | 0.7 (draf) — optimasi pemuatan: kode per halaman, foto responsif, font lokal, motion lebih ringan |
| Tanggal | 18 November 2026 |
| Jenis | Prototype untuk UAT dan kuesioner usability, bukan aplikasi produksi |
| Platform | Web, mobile-first (basis 390px), layout dashboard di ≥ 1024px |

---

## 1. Latar belakang dan tujuan

Mahasiswa di Fakultas Sains & Teknologi sering menemukan fasilitas rusak (AC, lampu, kran, kursi, Wi-Fi, dan lainnya), tetapi belum punya cara yang jelas untuk melaporkan dan memantau tindak lanjutnya. Prototype ini dipakai untuk menguji apakah alur pelaporan bisa dipahami dan diselesaikan mahasiswa tanpa bantuan.

**Tujuan prototype**
1. Responden bisa menyelesaikan tugas UAT T1–T6 tanpa jalan buntu.
2. Tampilan konsisten (satu komponen tombol, chip status, kartu) dan istilah baku "Laporan".
3. Tiap responden mulai dari kondisi data yang sama (data direset ke seed setiap kali menekan **Masuk**).

**Bukan tujuan**
- Backend, database, autentikasi sungguhan, notifikasi, atau unggah file sungguhan.
- Sisi admin/petugas, manajemen pengguna, pengaturan, chat, peta, laporan PDF, onboarding/tutorial.

## 2. Pengguna

| Persona | Keterangan |
|---|---|
| Mahasiswa pelapor | Mahasiswa satu fakultas, mayoritas memakai smartphone, ingin melapor cepat dan tahu laporannya sudah sampai mana. |

Hanya satu peran yang dibangun: mahasiswa pelapor.

## 3. Stack dan batasan teknis

| Aspek | Keputusan |
|---|---|
| Framework | React 18 + Vite |
| Bahasa | **JavaScript** (JSX), konsisten di seluruh proyek |
| Styling | Tailwind CSS |
| Ikon | lucide-react |
| Routing | react-router-dom dengan **HashRouter** (jalan di GitHub Pages tanpa konfigurasi server) |
| State | React Context + localStorage |
| Build | `vite.config.js` dengan `base: './'`, output ke `dist/` |
| Font | Inter, disimpan sendiri lewat `@fontsource-variable/inter` (satu file variabel Latin), fallback system-ui sans |
| Animasi | **`motion`** (paket `motion`, impor dari `motion/react` dan `motion/react-animate-view`) untuk skeleton shimmer dan animasi centang sukses. |
| Tema | Mode terang (default) dan mode gelap, lewat kelas `dark` di `<html>` (`darkMode: 'class'` di Tailwind) |
| Library lain | Tidak ada library UI atau state management tambahan |

> Catatan: ketentuan tugas menyebut "tidak ada library UI atau state besar lain". `motion` adalah library animasi, bukan library UI atau state, dan ditambahkan atas permintaan. Jika pengampu keberatan, shimmer dan centang bisa diganti CSS murni tanpa mengubah tampilan.

**Aturan state**
- Seluruh data laporan disimpan di Context dan disalin ke localStorage agar bertahan saat halaman di-refresh.
- Setiap kali tombol **Masuk** ditekan dengan input valid, data dikembalikan ke seed.
- Status "sudah masuk" disimpan di localStorage. Halaman selain Masuk dilindungi: jika belum masuk, pengguna diarahkan ke halaman Masuk.
- Pilihan tema (terang/gelap) disimpan terpisah di localStorage dan **tidak** ikut direset saat Masuk. Jika belum pernah dipilih, mengikuti `prefers-color-scheme` perangkat.

## 4. Struktur folder

```
SIPAFAS/
├─ docs/PRD.md
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json
├─ README.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx                # HashRouter + daftar route + route guard
   ├─ index.css              # Tailwind + token warna + transisi wipe
   ├─ assets/gedung-fakultas.webp  # foto halaman Masuk
   ├─ lib/
   │  └─ cn.js               # helper kecil penggabung className
   ├─ context/
   │  ├─ ReportContext.jsx   # data laporan, user, login/logout, aksi
   │  └─ ThemeContext.jsx    # tema terang/gelap
   ├─ data/
   │  └─ seed.js             # user dummy, laporan awal, kategori
   ├─ components/
   │  ├─ Button.jsx          # varian: primary, secondary
   │  ├─ StatusChip.jsx      # satu-satunya chip status
   │  ├─ Card.jsx            # satu-satunya kartu
   │  ├─ Dialog.jsx          # modal: Esc menutup, fokus terkelola
   │  ├─ FormField.jsx       # label + input + pesan kesalahan
   │  ├─ StarRating.jsx
   │  ├─ Timeline.jsx
   │  ├─ BottomNav.jsx       # mobile
   │  ├─ Sidebar.jsx         # desktop
   │  ├─ AppLayout.jsx       # memilih BottomNav / Sidebar + top bar
   │  ├─ ThemeToggle.jsx     # tombol ganti tema
   │  ├─ Skeleton.jsx        # Bone + Shimmer (motion)
   │  ├─ SkeletonSwap.jsx    # AnimateView: wipe dari skeleton ke konten
   │  └─ SuccessCheck.jsx    # animasi centang sukses (motion)
   └─ pages/
      ├─ LoginPage.jsx
      ├─ HomePage.jsx
      ├─ CreateReportPage.jsx
      ├─ HistoryPage.jsx
      ├─ ReportDetailPage.jsx
      └─ ProfilePage.jsx
```

## 5. Route dan navigasi

| Route | Halaman | Navigasi tampil? |
|---|---|---|
| `#/masuk` | Masuk | Tidak |
| `#/` (alias `#/beranda`) | Beranda | Ya |
| `#/buat` | Buat Laporan | Ya |
| `#/riwayat` | Riwayat Laporan | Ya |
| `#/laporan/:id` | Detail Laporan | Ya |
| `#/profil` | Profil | Ya |

**Navigasi**
- **Mobile (< 1024px):** bottom navigation melayang (floating bar bersudut membulat) yang **mengikuti tema**: putih dengan border tipis di mode terang, ungu gelap #1C1B2E di mode gelap. **Lima item** (ikon + label teks): **Beranda, Riwayat, Lapor, Profil, Keluar**.
  - **Lapor** (di tengah) adalah menu cepat untuk membuat laporan, fokus utama aplikasi: lingkaran ungu #6D5BF6 berdiameter 60px dengan ikon plus putih, sedikit terangkat dari bar dan dikelilingi cincin warna latar halaman. Nama aksesibelnya "Buat Laporan".
  - **Keluar** berwarna merah (#D92D20 di mode terang, #FF8A80 di mode gelap) agar tegas berbeda dari menu lain, dan membuka dialog konfirmasi sebelum benar-benar keluar (mencegah salah ketuk).
  - Item aktif ditandai warna teks ungu (terang) / putih (gelap), huruf tebal, dan titik kecil di bawah label, bukan hanya perubahan warna. Tiap item minimal 44×44px; menu memakai `<NavLink>` dengan `aria-current="page"`.
- **Desktop (≥ 1024px):** mengacu referensi 3 (layout dashboard).
  - **Sidebar kiri** putih (gelap di mode gelap) dengan border kanan tipis: logo kotak ungu + teks "SIPAFAS", label kecil "Menu", lalu empat menu (Beranda, Buat Laporan, Riwayat, Profil). Menu aktif: latar ungu sangat muda (#F1EEFF) dengan teks/ikon ungu. Tombol **Keluar** berwarna merah di bagian bawah sidebar, dengan dialog konfirmasi yang sama.
  - **Top bar** di atas konten: judul halaman (misalnya "Beranda", "Riwayat Laporan"), `ThemeToggle`, dan avatar inisial + nama pengguna yang menjadi tautan ke Profil.
  - Elemen referensi yang **tidak** dipakai karena tidak berfungsi atau di luar cakupan: kotak pencarian, ikon bantuan, lonceng notifikasi, menu "Store", kartu "Switch to Pro", dropdown "This Month", tombol "Export".
- **Mobile:** header kecil berisi judul halaman dan `ThemeToggle`; bottom navigation tetap seperti di atas.
- Referensi 1 punya 5 ikon (termasuk bookmark dan pengaturan). Ikon tersebut **tidak** dipakai karena di luar cakupan.

## 6. Spesifikasi halaman

### 6.1 Masuk (T1)

Mengacu mockup login aplikasi mobile (foto/ilustrasi di atas, lembar form putih di bawah), dengan foto gedung fakultas sebagai visual utama. Tidak ada animasi di halaman ini.

**Desktop (≥ 1024px): layar dibagi dua**

| Kiri (50%) | Kanan (50%) |
|---|---|
| Logo + tombol tema di atas, form Masuk di tengah | Foto gedung Fakultas Sains & Teknologi (`src/assets/gedung-fakultas.webp`) memenuhi seluruh separuh kanan layar (tanpa bingkai atau sudut melengkung), dengan gradien ungu tua statis di bagian bawah dan teks putih: nama fakultas + "Laporkan kerusakan fasilitas, pantau tindak lanjutnya." |

**Mobile (< 1024px)**
- Bagian atas: foto gedung (tinggi ±300px) dengan lapisan ungu tua agar teks putih terbaca, nama aplikasi, tombol tema, dan judul "Laporkan kerusakan fasilitas, pantau tindak lanjutnya." **seluruhnya putih** (tidak ada bagian berwarna ungu, karena akan tenggelam di lapisan ungu).
- Lembar form berwarna `--surface` dengan sudut atas membulat (28px) yang menimpa bagian bawah foto, seperti mockup.

**Isi form (sama di kedua ukuran)**
- Judul "Masuk" (rata tengah), subjudul "Sistem Informasi Pelaporan Fasilitas" dan "Fakultas Sains & Teknologi".
- Input **NIM** (ikon kartu identitas di kiri, `inputmode="numeric"`) dan **Kata sandi** (ikon gembok di kiri, tombol tampilkan/sembunyikan dengan `aria-label`). Gaya input: latar `--surface-2`, tanpa garis tepi sampai di-hover/fokus.
- Tombol utama **Masuk** lebar penuh.
- Catatan kecil: "Prototype: gunakan NIM dan kata sandi apa saja."
- Validasi: kolom kosong menampilkan "NIM wajib diisi." / "Kata sandi wajib diisi." di bawah kolomnya, `aria-invalid`, fokus pindah ke kolom kosong pertama.
- Jika valid: data direset ke seed, status masuk disimpan, pindah ke Beranda.
- Elemen mockup yang **tidak** dipakai karena tidak berfungsi atau di luar cakupan: "Remember me", "Forgot password", tombol login Apple/Google, dan tautan Sign up.

**Aksesibilitas foto:** `alt="Gedung Fakultas Sains & Teknologi"`. Teks di atas foto selalu berada di atas lapisan gelap agar kontrasnya terjaga.

### 6.2 Beranda

Layout dan gaya mengacu referensi 3 (dashboard), dengan warna ungu fakultas dan latar putih.

- **Banner sapaan** (radius 26px, teks putih): "Halo, [Nama]" dan subjudul "Pantau laporan fasilitas Anda di sini."
  - Latar gradasi lembut ungu #6D5BF6 → #4A3BC9 (statis) dengan bentuk dekoratif tipis: lingkaran putih transparan 7% dan cincin garis di pojok kanan atas, cahaya ungu muda samar di bawah, dan pola titik halus (desktop). Semua bentuk diletakkan jauh dari teks agar kontras tetap ≥ 4.5:1, `aria-hidden`, dan tidak beranimasi.
  - Tombol **Buat Laporan** (Button primary versi terang) di kanan atas banner **hanya di desktop**. Di mobile disembunyikan karena sudah ada tombol Lapor di navigasi bawah.
- **4 kartu ringkasan berada di dalam banner** seperti referensi: tiap kartu berlatar putih, berisi kotak ikon berwarna (ikon status), angka besar, dan label di bawahnya. Pojok kanan atas tiap kartu diberi dua lingkaran samar berwarna status (dekoratif, statis) supaya tidak polos. Kartu: Menunggu, Diproses, Selesai, Total laporan. Semua angka dihitung dari data di Context.
  - "Diproses" menghitung status Diproses saja. Diverifikasi dan Dibatalkan tetap masuk Total.
  - Kartu ringkasan bersifat informasi, **tidak bisa diklik** (tanpa hover/pointer). Ikon titik-tiga ("…") di referensi **tidak** dipakai.
  - Mobile: grid 2×2 di bawah sapaan (banner memanjang ke bawah). Desktop: satu baris 4 kartu.
- **Panel "Laporan per kategori"** (gaya "Sales Overview" di referensi): judul dengan ikon, angka total di atas, lalu tiap kategori satu baris berisi nama kategori, batang progres bergaris diagonal ungu (pola stripe statis, tidak beranimasi) dengan lebar = jumlah ÷ total, dan label angka "3 laporan" di ujung batang. Hanya kategori yang punya laporan yang ditampilkan.
- **"Laporan terbaru"** (gaya "Recent orders" di referensi): **3 laporan terbaru** saja agar Beranda ringkas, terbaru di atas. Tautan "Lihat semua" ke Riwayat di kanan judul.
  - Desktop (≥ 1280px): tabel dengan header abu muda, kolom No. Laporan, Kategori, Lokasi, Tanggal, Status (chip). Seluruh baris adalah tautan ke Detail (hover latar abu muda, fokus terlihat). Tanpa checkbox, kotak pencarian, atau tombol "Sort by" dari referensi. Di bawah 1280px tampil sebagai daftar kartu.
  - Mobile: daftar kartu berisi informasi yang sama.
- **Desktop:** sidebar kiri, top bar, banner + kartu ringkasan, lalu dua kolom: Laporan terbaru (±2/3 lebar) dan Laporan per kategori (±1/3).
- Grafik batang bulanan seperti "Transactions Overview" di referensi **tidak** dibuat karena tidak ada di cakupan.

### 6.3 Buat Laporan (T2)

| Kolom | Tipe | Wajib | Pesan kesalahan |
|---|---|---|---|
| Kategori | Kartu pilihan (radio group) berikon, 2 kolom di mobile / 4 di desktop: Listrik, AC, Air dan Sanitasi, Furnitur, Jaringan, Kebersihan, Lainnya | Ya | "Pilih kategori laporan." |
| Lokasi / ruang | Teks dengan ikon pin, contoh "Ruang 2.04, Lab Komputer 1, Toilet Lt. 2". **Tidak ada pilihan gedung** karena fakultas hanya punya satu gedung. | Ya | "Isi lokasi atau nama ruang." |
| Deskripsi | Textarea, min. 10 karakter | Ya | "Jelaskan kerusakan minimal 10 karakter." |
| Foto | Simulasi: tombol "Pilih file" (input file, hanya baca nama + pratinjau lokal) atau tombol "Gunakan foto contoh" | Tidak | — |

- **Satu halaman (tanpa langkah "Selanjutnya")** agar tetap sederhana, tetapi diberi struktur supaya tidak polos:
  - **Bar progres "Kelengkapan laporan"** di bagian atas kartu form: menghitung kolom wajib yang sudah terisi ("2 dari 3 kolom wajib"), `role="progressbar"` dengan `aria-valuetext`.
  - Setiap bagian bernomor 1–4 (Kategori, Lokasi / ruang, Deskripsi kerusakan, Foto). Nomor berubah menjadi centang ungu saat bagian itu lengkap.
  - Area foto berupa kotak bergaris putus-putus dengan ikon dan dua tombol.
- Tombol utama **Kirim Laporan** dan tombol sekunder merah **Batal**.
- **Batal:** jika form masih kosong, langsung kembali ke Beranda. Jika sudah ada isian, muncul dialog "Batalkan pembuatan laporan?" / "Data yang sudah Anda isi akan hilang." dengan tombol **Lanjut mengisi** (fokus awal) dan **Ya, batalkan** (merah).
- **Kirim:** form divalidasi dulu. Jika ada kolom wajib kosong, pesan muncul di bawah kolom terkait dan fokus pindah ke kolom error pertama. Jika valid, muncul dialog konfirmasi "Kirim laporan ini?" berisi ringkasan (kategori, lokasi, deskripsi, foto) dengan tombol **Periksa lagi** dan **Ya, kirim**. Laporan baru dibuat setelah "Ya, kirim".
- Foto tidak diunggah ke mana pun. Yang disimpan hanya nama berkas (dan URL pratinjau sementara untuk sesi itu).
- Saat valid:
  - Laporan baru dibuat dengan nomor berurutan (format `LAP-2026-0008`, dst.), status **Menunggu**, tanggal sekarang, linimasa berisi satu entri "Menunggu — Laporan dikirim".
  - **Layar sukses dengan animasi centang** (gaya konfirmasi transaksi di aplikasi dompet digital, tanpa meniru merek mana pun). Tetap berupa dialog (`role="dialog"`), tetapi tampil **layar penuh** di mobile dan sebagai kartu besar di tengah layar (overlay) di desktop. Isinya di tengah:
    1. **Animasi centang (`SuccessCheck.jsx`, motion):**
       - Lingkaran ungu #6D5BF6 (diameter ±96px) membesar dari skala 0 ke 1 dengan efek pegas (`type: "spring"`, sedikit memantul), ±0,4 detik.
       - Tanda centang putih (SVG path) tergambar dari kiri ke kanan dengan `pathLength` 0 → 1, mulai setelah lingkaran muncul, ±0,35 detik.
       - Dua cincin tipis ungu muda memancar keluar dari lingkaran (skala 1 → 1,8, opacity 0,4 → 0), **sekali saja**, tidak berulang.
       - Total animasi < 1 detik, lalu diam.
    2. Teks "Laporan berhasil dikirim" (muncul dengan fade setelah centang selesai), nomor laporan dalam huruf tebal, dan chip status **Menunggu**.
    3. Kartu ringkasan kecil: kategori, lokasi, waktu kirim.
    4. Tombol utama **Lihat laporan** (ke Detail) dan tombol sekunder **Kembali ke Beranda**.
  - Fokus awal di judul "Laporan berhasil dikirim" agar pembaca layar langsung mengumumkannya. Esc menutup dialog dan pindah ke Beranda.
  - Jika `prefers-reduced-motion: reduce`: lingkaran dan centang langsung tampil penuh tanpa animasi.
  - Form dikosongkan.

### 6.4 Riwayat Laporan (T3, T4)

- Judul "Riwayat Laporan".
- Filter status berupa tab/segmented button horizontal. Di mobile, baris filter digeser ke samping (scrollbar disembunyikan) dengan **efek pudar di tepi kanan** sebagai tanda masih ada pilihan lain; tombol yang dipilih otomatis digeser ke tengah. Daftar laporan tetap menampilkan semua laporan dengan gulir halaman biasa (bukan kotak gulir terpisah). Pilihan filter: **Semua, Menunggu, Diverifikasi, Diproses, Selesai, Dibatalkan**. Tiap tombol menampilkan jumlah, misalnya "Selesai (2)". Tombol aktif memakai `aria-pressed="true"`.
- Daftar kartu laporan (urut terbaru di atas): nomor laporan, kategori, lokasi, tanggal, chip status. Seluruh kartu adalah tautan ke Detail.
- Empty state saat filter kosong: "Belum ada laporan dengan status [Status]." + tombol sekunder "Tampilkan semua".

### 6.5 Detail Laporan (T3, T5, T6)

- Tombol kembali (ikon + teks "Kembali").
- Header: nomor laporan, chip status.
- **Info laporan:** kategori, lokasi, tanggal dibuat, deskripsi, foto (pratinjau atau nama berkas; jika tidak ada: "Tidak ada foto").
- **Linimasa status:** urut kronologis, tiap entri berisi nama status, keterangan singkat, dan tanggal + jam. Entri terakhir ditandai sebagai status saat ini.
- **Batalkan Laporan** (tombol sekunder bernuansa bahaya) — hanya tampil jika status Menunggu.
  - Dialog konfirmasi: "Batalkan laporan LAP-…?" / "Laporan yang dibatalkan tidak dapat diproses lagi." Tombol **Ya, batalkan** (utama) dan **Tidak** (sekunder). Fokus awal di "Tidak". Esc = Tidak.
  - Setelah dibatalkan: status jadi Dibatalkan, entri linimasa baru ditambahkan, pesan konfirmasi singkat "Laporan dibatalkan." tampil di halaman (`role="status"`). Perubahan langsung tercermin di Riwayat dan Beranda.
- **Form Penilaian** — hanya tampil jika status Selesai dan belum dinilai.
  - Bintang 1–5 (radio group, tiap bintang `aria-label="3 dari 5 bintang"`, bisa dengan keyboard), komentar singkat opsional (maks. 200 karakter, ada penghitung).
  - Tombol **Kirim Penilaian**. Jika bintang belum dipilih: "Pilih jumlah bintang terlebih dahulu."
  - Setelah terkirim: form diganti ringkasan penilaian (bintang read-only + komentar) dan pesan "Terima kasih, penilaian Anda sudah terkirim."
- Jika ID tidak ditemukan: "Laporan tidak ditemukan." + tombol ke Riwayat.

### 6.6 Profil

- Kartu berisi inisial, nama dummy, NIM yang dipakai saat masuk, program studi placeholder.
- Tombol utama merah **Keluar** (Button `danger`): membuka dialog konfirmasi "Keluar dari SIPAFAS?" (Batal / Ya, keluar). Setelah dikonfirmasi, status masuk dihapus dan pengguna kembali ke halaman Masuk.
- Tidak ada menu lain.

### 6.7 Skeleton shimmer saat memuat

Diadaptasi dari kode referensi `SkeletonShimmer` (motion), ditulis ulang dalam JavaScript dan memakai token warna proyek.

**Di mana dipakai:** Beranda (kartu ringkasan, panel kategori, Laporan terbaru), Riwayat (daftar kartu), dan Detail Laporan (info + linimasa). Tidak dipakai di Masuk, Buat Laporan, dan Profil karena halaman tersebut tidak "memuat data".

**Perilaku**
- Karena tidak ada backend, pemuatan **disimulasikan**: saat halaman dibuka, skeleton tampil selama **±700ms**, lalu berganti ke konten asli. Waktunya dibuat singkat agar tidak menghambat responden UAT.
- Simulasi muat hanya terjadi saat halaman dibuka lewat navigasi atau refresh, **tidak** saat mengganti filter di Riwayat atau setelah aksi (batal/penilaian), agar umpan balik aksi terasa langsung.
- Bentuk skeleton meniru tata letak konten aslinya (ukuran kartu, baris tabel, lingkaran ikon) supaya tidak ada lompatan layout.

**Komponen**
- `Skeleton.jsx` berisi dua bagian seperti referensi:
  - `Bone`: kotak/lingkaran kosong dengan ukuran tertentu.
  - `Shimmer`: membungkus elemen asli yang dibuat tak terlihat (`visibility: hidden`) supaya ukuran skeleton persis sama dengan kontennya.
  - Keduanya memakai `motion.div` dengan `animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}`, `transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}`, dan gradien `linear-gradient(90deg, base 25%, highlight 50%, base 75%)` berukuran `200% 100%`.
- `SkeletonSwap.jsx`: membungkus pasangan skeleton/konten dengan `AnimateView` dari `motion/react-animate-view` dan transisi **wipe** (variabel CSS `--wipe` dari 100% ke -100%, 0,6 detik, `easeInOut`) seperti referensi. Aturan `@property --wipe` dan `::view-transition-*` ditaruh di `index.css`, dengan radius 24px agar cocok dengan kartu.
  - **Kerangka tetap diam:** navigasi bawah, header mobile, top bar, dan sidebar masing-masing diberi `view-transition-name` sendiri dengan lapisan di atas konten (`z-index` lebih tinggi) dan tanpa animasi. Tanpa ini, area konten yang diangkat ke lapisan transisi menutupi navbar sesaat sehingga navbar tampak ikut "refresh". Saat ganti tema, nama-nama ini dinonaktifkan (kelas `theme-switching`) supaya kerangka ikut terbuka bersama animasi lingkaran.
  - **Fallback:** jika browser belum mendukung View Transitions API atau `AnimateView` tidak tersedia di versi `motion` yang terpasang, konten langsung menggantikan skeleton tanpa wipe. Fitur ini dicek saat build.
  - **Hasil pengecekan (18 Nov 2026):** `AnimateView` di `motion` 14 membutuhkan React 19.3, sedangkan ketentuan meminta React 18. Karena itu wipe diimplementasikan langsung dengan `document.startViewTransition` + Web Animations API (efek visual sama). Jika transisi tertunda lebih dari 1 detik, konten langsung ditampilkan.
- Warna tulang skeleton mengikuti tema:
  - Terang: base #EEEDF5, highlight #F8F7FC
  - Gelap: base rgba(255,255,255,.06), highlight rgba(255,255,255,.12) (sama seperti referensi)

**Aksesibilitas**
- Wadah yang sedang memuat diberi `aria-busy="true"` dan teks tersembunyi "Memuat…" untuk pembaca layar. Skeleton sendiri `aria-hidden="true"`.
- Jika `prefers-reduced-motion: reduce`: skeleton tetap tampil tetapi tanpa kilau bergerak, dan wipe diganti pergantian langsung.

## 7. Data seed

**Pengguna:** nama dummy, misalnya "Rani Pratiwi", program studi "[NAMA PROGRAM STUDI]", Fakultas Sains & Teknologi.

**Kategori:** Listrik, AC, Air dan Sanitasi, Furnitur, Jaringan, Kebersihan, Lainnya.
**Lokasi:** satu gedung fakultas, jadi lokasi cukup berupa nama ruang/area.

**Laporan awal (7 laporan, mencakup semua status):**

| No. | Kategori | Lokasi | Status | Catatan |
|---|---|---|---|---|
| LAP-2026-0001 | Furnitur | Ruang 1.03 | Selesai | Sudah dinilai (contoh tampilan read-only) |
| LAP-2026-0002 | Air dan Sanitasi | Toilet Lt. 2 | Dibatalkan | |
| LAP-2026-0003 | Listrik | Koridor Lt. 2 | Selesai | **Belum dinilai** → target T6 |
| LAP-2026-0004 | Jaringan | Ruang 3.01 | Diproses | |
| LAP-2026-0005 | AC | Ruang 2.04 | Diverifikasi | |
| LAP-2026-0006 | Kebersihan | Kantin | Menunggu | Target T5 |
| LAP-2026-0007 | AC | Ruang 2.10 | Menunggu | |

Tiap laporan punya linimasa yang masuk akal (misalnya Selesai: Menunggu → Diverifikasi → Diproses → Selesai), tanggal dalam rentang Oktober–November 2026.

**Model data laporan**
```js
{
  id: 'LAP-2026-0007',
  category: 'AC',
  room: 'Ruang 2.10',
  description: '...',
  photoName: null | 'foto.jpg',
  status: 'Menunggu' | 'Diverifikasi' | 'Diproses' | 'Selesai' | 'Dibatalkan',
  createdAt: '2026-11-15T09:20:00',
  timeline: [{ status, note, date }],
  rating: null | { stars: 1-5, comment, date }
}
```

**Aksi Context:** `login(nim)`, `logout()`, `createReport(data)` → mengembalikan laporan baru, `cancelReport(id)`, `rateReport(id, stars, comment)`, plus nilai turunan `summary` dan `byCategory`.

## 8. Sistem desain

### Token warna (terang dan gelap)

Warna fakultas ungu menjadi aksen utama. Mode terang berlatar **putih**. Token didefinisikan sebagai CSS variable di `index.css` (`:root` dan `.dark`) lalu dipetakan ke Tailwind (`bg-surface`, `text-muted`, dst.), sehingga komponen tidak perlu tahu tema mana yang aktif.

| Token | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| `--bg` | #FFFFFF | #0E0D17 | Latar halaman |
| `--surface` | #FFFFFF | #17162A | Kartu, sidebar, top bar |
| `--surface-2` | #F7F6FB | #1F1D36 | Header tabel, hover baris, latar input |
| `--border` | #ECEBF3 | #2C2A47 | Garis kartu, pemisah, border input |
| `--text` | #1B1B2F | #ECEBF7 | Teks utama |
| `--muted` | #5B5B6E | #A6A4C0 | Teks sekunder (≥ 4.5:1 di kedua tema) |
| `--accent` | #6D5BF6 | #6D5BF6 | Latar tombol utama, banner, lingkaran centang (teks putih 5:1) |
| `--accent-hover` | #5A48E8 | #7E6EF8 | Hover tombol utama |
| `--accent-text` | #5B48E6 | #B3A8FF | Teks/ikon ungu di atas `--bg`/`--surface` (tautan, menu aktif) |
| `--accent-soft` | #F1EEFF | #2A2350 | Latar menu aktif, latar kotak ikon |
| `--nav` | #FFFFFF | #1C1B2E | Latar bottom navigation mobile (border `--border`, bayangan lembut) |
| `--nav-text` | #5B5B6E | #B4B4C8 | Ikon + label menu tidak aktif |
| `--nav-active` | #5B48E6 | #FFFFFF | Ikon + label menu aktif (di atas pil `--accent-soft`) |
| `--focus` | #6D5BF6 | #B3A8FF | Ring fokus 2px + offset 2px |

| Token lain | Nilai |
|---|---|
| Banner Beranda | #6D5BF6 di kedua tema (di mode gelap boleh sedikit gradien ke #5444D6, statis) |
| Foto halaman Masuk | lapisan gradien ungu tua #1E1450 (statis) di atas foto, sama di kedua tema |
| Radius | kartu 24px, tombol/input 14px, chip penuh (pill) |
| Bayangan | terang: `0 1px 2px rgb(0 0 0 / .04), 0 8px 24px rgb(40 30 90 / .06)`; gelap: tanpa bayangan, cukup border |
| Jarak | kelipatan 4px, jarak antarbagian 24–32px |
| Font | Inter 400/500/600/700 |

**ThemeToggle:** tombol ikon (Sun/Moon dari lucide) dengan `aria-label` "Aktifkan mode gelap" / "Aktifkan mode terang", tampil di halaman Masuk, top bar desktop, dan header mobile. Saat ditekan, tema baru terbuka sebagai **lingkaran yang membesar dari posisi tombol** hingga menutup layar (±0,45 detik), diadaptasi dari AnimatedThemeToggler (Magic UI) dengan View Transitions API. Ini satu-satunya "pengaturan" yang ada, dan ditambahkan atas permintaan.

### Warna status (teks harus ≥ 4.5:1 di atas latar chip, di kedua tema)
| Status | Terang: latar / teks | Gelap: latar / teks | Ikon |
|---|---|---|---|
| Menunggu | #FEF3C7 / #92400E | #3A2A0A / #FCD34D | Clock |
| Diverifikasi | #DBEAFE / #1E40AF | #172554 / #93C5FD | ShieldCheck |
| Diproses | #EDE9FE / #5B21B6 | #2E1A5E / #C4B5FD | Wrench |
| Selesai | #DCFCE7 / #166534 | #0F2E1C / #86EFAC | CheckCircle2 |
| Dibatalkan | #F1F1F4 / #4B4B5A | #26262F / #C4C4CF | XCircle |

Chip selalu menampilkan **teks status + ikon**, tidak hanya warna. Kotak ikon di kartu ringkasan Beranda memakai warna status yang sama.

### Komponen (satu sumber)
- **Button:** `variant="primary" | "secondary"`, opsi `size`, `fullWidth`, `icon`, `danger` (untuk Batalkan). Selalu `<button>` (atau `Link` bergaya tombol untuk navigasi), tinggi min. 44px, state hover/tekan/fokus/disabled.
- **StatusChip:** menerima `status`, memetakan warna + ikon dari satu tabel.
- **Card:** wadah putih radius 24px; varian `as="link"` untuk kartu yang bisa diklik (punya hover dan fokus terlihat). Kartu non-klik tidak punya efek hover.
- **Dialog:** `role="dialog"`, `aria-modal`, `aria-labelledby`; fokus masuk ke dialog saat dibuka, terkunci di dalam (focus trap), kembali ke pemicu saat ditutup; Esc menutup; latar di belakang tidak bisa digulir.

### Gerak
- Transisi halus 150–200ms untuk hover/tekan/fokus.
- Tanpa animasi melayang, tilt, parallax, scroll-reveal, atau gradien beranimasi, **kecuali** dua hal yang diminta secara khusus:

| Animasi | Lokasi | Durasi | Berulang? | Reduced motion |
|---|---|---|---|---|
| Skeleton shimmer + wipe | Beranda, Riwayat, Detail | ±700ms muat, wipe 0,6 dtk | Shimmer berulang selama memuat saja | Tanpa kilau, tanpa wipe |
| Centang sukses | Setelah Kirim Laporan | < 1 dtk | Tidak | Langsung tampil |
| Lingkaran ganti tema | Saat menekan ThemeToggle | ±0,45 dtk | Tidak | Tema langsung berganti |

## 9. Aksesibilitas (checklist)

- [ ] Kontras teks ≥ 4.5:1 (termasuk chip status, teks di banner ungu, label navigasi gelap).
- [ ] Target sentuh ≥ 44×44px.
- [ ] Semua aksi memakai `<button>`, navigasi memakai `<a>`/`Link`.
- [ ] Semua input punya `<label>`; error terhubung lewat `aria-describedby`.
- [ ] Ikon tanpa teks punya `aria-label`.
- [ ] Dialog: Esc menutup, fokus terkelola.
- [ ] Fokus keyboard terlihat jelas (ring aksen).
- [ ] Pesan sukses/konfirmasi memakai `role="status"`.
- [ ] Skeleton: `aria-busy` + teks "Memuat…" tersembunyi; centang sukses dan shimmer menghormati `prefers-reduced-motion`.
- [ ] Kontras dicek ulang di **mode gelap** (teks, chip, tautan ungu, label navigasi).
- [ ] `lang="id"` di `<html>`.

## 10. Tugas UAT dan kriteria penerimaan

| Tugas | Langkah yang diharapkan | Kriteria lulus |
|---|---|---|
| **T1 Masuk** | Isi NIM + kata sandi → Masuk | Kolom kosong memunculkan pesan di kolomnya; input terisi apa pun membuka Beranda dengan "Halo, [Nama]"; data kembali ke seed. |
| **T2 Membuat laporan lengkap** | Beranda → Buat Laporan → isi semua kolom (+ foto contoh) → Kirim | Kolom wajib kosong memunculkan pesan per kolom; jika lengkap muncul layar sukses dengan animasi centang, nomor laporan, dan chip Menunggu. |
| **T3 Menemukan status laporan baru** | Dialog sukses → Lihat laporan, **atau** Beranda/Riwayat → klik laporan teratas | Laporan baru ada di posisi teratas Riwayat dan Laporan terbaru dengan status Menunggu; kartu Menunggu dan Total di Beranda bertambah 1. |
| **T4 Riwayat + filter Selesai** | Navigasi → Riwayat → filter Selesai | Hanya laporan Selesai yang tampil; tombol filter aktif terlihat jelas. |
| **T5 Membatalkan laporan Menunggu** | Buka laporan Menunggu → Batalkan → Ya, batalkan | Status menjadi Dibatalkan di Detail, Riwayat, dan Beranda; angka Menunggu berkurang; tombol Batalkan hilang. |
| **T6 Memberi penilaian** | Buka laporan Selesai (LAP-2026-0003) → pilih bintang → komentar → Kirim Penilaian | Pesan konfirmasi tampil; form berganti ringkasan penilaian; data tetap ada setelah refresh. |

**Kriteria umum**
- `npm run build` sukses tanpa error.
- Tidak ada tombol, tautan, atau kartu yang tampak bisa diklik tetapi tidak berfungsi.
- Istilah baku "Laporan" di seluruh UI (tidak ada "aduan"). Nama status persis sesuai daftar.
- Semua teks UI dalam Bahasa Indonesia.

## 11. Keluaran

1. Kode sesuai struktur folder di bagian 4.
2. `README.md`: cara menjalankan (`npm install`, `npm run dev`), build (`npm run build`), dan deploy ke GitHub Pages (upload `dist/` atau pakai `gh-pages`).
3. Laporan verifikasi: hasil build + penelusuran T1–T6 satu per satu.

## 12. Keputusan yang perlu dikonfirmasi

1. ~~**Animasi panel login**~~ — Awalnya diputuskan bergerak dan bisa dijeda. **Diganti (18 Nov 2026):** marquee, kartu cerita, dan tombol jeda dihapus; halaman Masuk memakai foto gedung fakultas tanpa animasi (lihat 6.1).
2. **Isi kartu animasi:** usulan berupa contoh cerita pelaporan (fiktif, tanpa statistik). Alternatif: kartu berisi contoh laporan dengan chip status.
3. ~~**Gaya bottom navigation gelap**~~ — **Diputuskan (18 Nov 2026):** bottom navigation mengikuti tema (putih di mode terang, gelap di mode gelap).
4. **Bahasa:** JavaScript (bukan TypeScript), demi kesederhanaan. Kode referensi SkeletonShimmer yang berbentuk TypeScript ditulis ulang ke JavaScript.
5. **Diputuskan (18 Nov 2026), atas permintaan:** skeleton shimmer dari `motion`, animasi centang sukses, layout Beranda mengikuti referensi dashboard dengan warna ungu dan latar putih, serta mode gelap. Hal-hal ini di luar ketentuan awal tugas (tambahan library dan animasi, toggle tema), jadi sebaiknya disebutkan saat presentasi atau dikonfirmasi ke pengampu.
6. **Durasi skeleton** ±700ms. Bisa diperpendek kalau terasa menghambat saat uji coba.
7. **Diputuskan (18 Nov 2026):** kolom **Urgensi dihapus** dari form, data, dan tampilan. Jika diisi mahasiswa, hampir semua laporan akan dipilih "Tinggi"; urgensi semestinya ditentukan petugas (di luar cakupan prototype ini).
8. **Diputuskan (18 Nov 2026):** navigasi bawah mobile berisi 5 menu dengan tombol Lapor di tengah dan Keluar berwarna merah + konfirmasi; Laporan terbaru di Beranda dibatasi 3; ganti tema memakai animasi lingkaran.
9. **Diputuskan (18 Nov 2026):** pilihan gedung dihapus (satu gedung). Form Buat Laporan tetap satu halaman dengan bar progres dan bagian bernomor (bukan multi-langkah). Kirim dan Batal (jika sudah ada isian) memakai dialog konfirmasi. Tombol Buat Laporan di banner hanya tampil di desktop.
10. **Diputuskan (18 Nov 2026) — optimasi pemuatan:** halaman dimuat terpisah (`React.lazy`) dengan prefetch saat senggang; `motion` hanya di halaman yang memakainya via `LazyMotion` + `m`; foto login dua ukuran lewat `<picture>`; font Inter lokal (tanpa Google Fonts); tanpa `backdrop-blur`/`blur`.
