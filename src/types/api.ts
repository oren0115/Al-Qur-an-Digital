export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  };
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
}

export interface Tafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  ayat: Array<{
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    tafsir: {
      id: string;
      teks: string;
    };
  }>;
}

export interface Bookmark {
  surahNomor: number;
  surahNama: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
  timestamp: number;
}

