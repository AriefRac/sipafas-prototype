// Data awal (seed). Dikembalikan setiap kali pengguna menekan "Masuk".

export const STATUSES = ['Menunggu', 'Diverifikasi', 'Diproses', 'Selesai', 'Dibatalkan']

export const CATEGORIES = [
  'Listrik',
  'AC',
  'Air dan Sanitasi',
  'Furnitur',
  'Jaringan',
  'Kebersihan',
  'Lainnya',
]



export const FACULTY = 'Fakultas Sains & Teknologi'

export const SEED_USER = {
  name: 'Rani Pratiwi',
  prodi: '[NAMA PROGRAM STUDI]',
}

const t = (status, note, date) => ({ status, note, date })

export const SEED_REPORTS = [
  {
    id: 'LAP-2026-0001',
    category: 'Furnitur',
    room: 'Ruang 1.03',
    description: 'Tiga kursi di barisan belakang patah sandarannya dan tidak bisa dipakai.',
    photoName: 'kursi-patah.jpg',
    status: 'Selesai',
    createdAt: '2026-10-06T08:15:00',
    timeline: [
      t('Menunggu', 'Laporan dikirim', '2026-10-06T08:15:00'),
      t('Diverifikasi', 'Laporan diperiksa petugas', '2026-10-06T13:40:00'),
      t('Diproses', 'Kursi sedang diperbaiki', '2026-10-08T09:00:00'),
      t('Selesai', 'Kursi sudah diganti', '2026-10-10T15:20:00'),
    ],
    rating: { stars: 5, comment: 'Cepat ditangani, terima kasih.', date: '2026-10-11T10:00:00' },
  },
  {
    id: 'LAP-2026-0002',
    category: 'Air dan Sanitasi',
    room: 'Toilet Lt. 2',
    description: 'Kran wastafel menetes terus walaupun sudah ditutup rapat.',
    photoName: null,
    status: 'Dibatalkan',
    createdAt: '2026-10-14T10:05:00',
    timeline: [
      t('Menunggu', 'Laporan dikirim', '2026-10-14T10:05:00'),
      t('Dibatalkan', 'Dibatalkan oleh pelapor', '2026-10-14T11:30:00'),
    ],
    rating: null,
  },
  {
    id: 'LAP-2026-0003',
    category: 'Listrik',
    room: 'Koridor Lt. 2',
    description: 'Empat lampu koridor mati sehingga lorong gelap saat sore hari.',
    photoName: 'lampu-koridor.jpg',
    status: 'Selesai',
    createdAt: '2026-10-21T16:45:00',
    timeline: [
      t('Menunggu', 'Laporan dikirim', '2026-10-21T16:45:00'),
      t('Diverifikasi', 'Laporan diperiksa petugas', '2026-10-22T08:30:00'),
      t('Diproses', 'Penggantian lampu dijadwalkan', '2026-10-22T13:00:00'),
      t('Selesai', 'Lampu sudah diganti', '2026-10-23T10:10:00'),
    ],
    rating: null,
  },
  {
    id: 'LAP-2026-0004',
    category: 'Jaringan',
    room: 'Ruang 3.01',
    description: 'Wi-Fi di ruang kelas sering terputus saat banyak mahasiswa terhubung.',
    photoName: null,
    status: 'Diproses',
    createdAt: '2026-11-03T09:20:00',
    timeline: [
      t('Menunggu', 'Laporan dikirim', '2026-11-03T09:20:00'),
      t('Diverifikasi', 'Laporan diperiksa petugas', '2026-11-04T10:00:00'),
      t('Diproses', 'Pemeriksaan perangkat jaringan', '2026-11-06T14:15:00'),
    ],
    rating: null,
  },
  {
    id: 'LAP-2026-0005',
    category: 'AC',
    room: 'Ruang 2.04',
    description: 'AC menyala tetapi tidak dingin, ruangan terasa panas saat perkuliahan siang.',
    photoName: 'ac-2-04.jpg',
    status: 'Diverifikasi',
    createdAt: '2026-11-10T11:00:00',
    timeline: [
      t('Menunggu', 'Laporan dikirim', '2026-11-10T11:00:00'),
      t('Diverifikasi', 'Laporan diperiksa petugas', '2026-11-11T09:45:00'),
    ],
    rating: null,
  },
  {
    id: 'LAP-2026-0006',
    category: 'Kebersihan',
    room: 'Kantin',
    description: 'Tempat sampah di area kantin penuh dan belum diangkut sejak kemarin.',
    photoName: null,
    status: 'Menunggu',
    createdAt: '2026-11-13T12:30:00',
    timeline: [t('Menunggu', 'Laporan dikirim', '2026-11-13T12:30:00')],
    rating: null,
  },
  {
    id: 'LAP-2026-0007',
    category: 'AC',
    room: 'Ruang 2.10',
    description: 'Remote AC hilang sehingga suhu ruangan tidak bisa diatur.',
    photoName: null,
    status: 'Menunggu',
    createdAt: '2026-11-15T08:05:00',
    timeline: [t('Menunggu', 'Laporan dikirim', '2026-11-15T08:05:00')],
    rating: null,
  },
]

// Ilustrasi sederhana untuk tombol "Gunakan foto contoh" (bukan foto asli).
export const SAMPLE_PHOTO = {
  name: 'contoh-kerusakan.jpg',
  url:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#EDE9FE"/><rect x="40" y="40" width="240" height="70" rx="10" fill="#C4B5FD"/><rect x="56" y="58" width="208" height="10" rx="5" fill="#8B7CF8"/><rect x="56" y="78" width="140" height="10" rx="5" fill="#8B7CF8"/><path d="M80 150 q20 -16 40 0 t40 0" stroke="#6D5BF6" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M180 150 q20 -16 40 0" stroke="#6D5BF6" stroke-width="6" fill="none" stroke-linecap="round"/><text x="160" y="186" font-family="sans-serif" font-size="13" text-anchor="middle" fill="#5B21B6">Foto contoh</text></svg>`,
    ),
}
