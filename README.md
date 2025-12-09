# Al-Qur'an Digital

Aplikasi web Al-Qur'an Digital, dibangun dengan React dan TypeScript. Aplikasi ini menyediakan akses mudah untuk membaca, mendengarkan, dan mempelajari Al-Qur'an dengan berbagai fitur interaktif, termasuk kumpulan doa-doa harian.

## 🛠️ Teknologi

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component Library
- **Radix UI** - Accessible Components
- **EQuran.id API** - Data Source (Surah, Ayat, Tafsir, Doa)

## 📦 Instalasi

1. Clone repository:
```bash
git clone https://github.com/oren0115/Al-Qur-an-Digital
cd Al-Qur-an-Digital
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Menjalankan

### Development
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## ✨ Fitur

### 📖 Al-Qur'an
- **Daftar Surah** - Lihat semua 114 surah dengan informasi lengkap
- **Detail Surah** - Baca ayat-ayat dengan teks Arab, Latin, dan terjemahan Indonesia
- **Audio Recitation** - Dengarkan bacaan Al-Qur'an dari berbagai qari
- **Tafsir** - Pelajari penjelasan ayat dengan tafsir
- **Juz** - Navigasi berdasarkan juz (30 juz)

### 📿 Doa & Dzikir
- **Kumpulan Doa** - Akses 227+ doa harian yang dikelompokkan berdasarkan kategori
- **Detail Doa** - Lihat doa lengkap dengan teks Arab, transliterasi, dan terjemahan
- **Pencarian Doa** - Cari doa berdasarkan nama, kategori, atau kata kunci

### 🔖 Fitur Interaktif
- **Bookmark** - Simpan ayat favorit untuk dibaca nanti
- **Catatan** - Tambahkan catatan pribadi pada setiap ayat
- **Riwayat** - Lihat surah yang baru saja dibaca
- **Progress Tracking** - Lacak progress pembacaan Al-Qur'an
- **Share** - Bagikan ayat ke media sosial atau aplikasi lain

### ⚙️ Pengaturan
- **Pilih Qari** - Pilih qari favorit untuk audio
- **Ukuran Font** - Sesuaikan ukuran font Arab dan Latin
- **Tampilan Terjemahan** - Toggle untuk menampilkan/menyembunyikan terjemahan
- **Auto-play** - Otomatis memutar ayat berikutnya
- **Repeat Mode** - Ulang ayat atau surah
- **Tema** - Mode terang/gelap

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Struktur Proyek

```
src/
├── components/       # Komponen UI reusable
│   ├── ui/          # Shadcn UI components
│   ├── AudioPlayer.tsx
│   ├── AyatCard.tsx
│   ├── BottomNav.tsx
│   ├── NoteDialog.tsx
│   └── ShareDialog.tsx
├── contexts/        # React Context untuk state management
│   ├── SettingsContext.tsx
│   ├── BookmarkContext.tsx
│   ├── HistoryContext.tsx
│   ├── NotesContext.tsx
│   └── ProgressContext.tsx
├── pages/           # Halaman aplikasi
│   ├── Home.tsx
│   ├── SurahDetail.tsx
│   ├── SurahListPage.tsx
│   ├── DoaListPage.tsx
│   ├── DoaDetailPage.tsx
│   ├── BookmarkPage.tsx
│   ├── SettingsPage.tsx
│   ├── JuzPage.tsx
│   └── StatisticsPage.tsx
├── services/        # API services
│   └── api.ts
├── types/           # TypeScript types
│   └── api.ts
└── App.tsx          # Root component
```

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` di root project (opsional):

```env
VITE_BASE_URL=https://equran.id/api/v2
```

## 🔌 API Endpoints

Aplikasi ini menggunakan API dari [EQuran.id](https://equran.id):

- **Surah**: `GET /api/v2/surat` - Daftar semua surah
- **Detail Surah**: `GET /api/v2/surat/{nomor}` - Detail surah dengan ayat
- **Tafsir**: `GET /api/v2/tafsir/{nomor}` - Tafsir surah
- **Doa**: `GET /api/doa` - Kumpulan doa-doa harian

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan pembelajaran.
```

## 🙏 Credits

- **API**: [EQuran.id](https://equran.id)
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)

---

Dibuat dengan ❤️ untuk memudahkan akses Al-Qur'an Digital
