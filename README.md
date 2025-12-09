# Al-Qur'an Digital

Aplikasi web Al-Qur'an Digital, dibangun dengan React dan TypeScript. Aplikasi ini menyediakan akses mudah untuk membaca, mendengarkan, dan mempelajari Al-Qur'an dengan berbagai fitur interaktif.

## 🛠️ Teknologi

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component Library
- **Radix UI** - Accessible Components
- **EQuran.id API** - Data Source

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
│   ├── BookmarkPage.tsx
│   ├── SettingsPage.tsx
│   └── JuzPage.tsx
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

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan pembelajaran.
```

## 🙏 Credits

- **API**: [EQuran.id](https://equran.id)
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com)

---

Dibuat dengan ❤️ untuk memudahkan akses Al-Qur'an Digital
