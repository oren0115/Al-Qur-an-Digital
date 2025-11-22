import type { ApiResponse, Surah, SurahDetail, Tafsir } from "@/types/api";

const API_BASE = import.meta.env.VITE_BASE_URL;

export async function getSurahList(): Promise<Surah[]> {
  const response = await fetch(`${API_BASE}/surat`);
  const data: ApiResponse<Surah[]> = await response.json();
  return data.data;
}

export async function getSurahDetail(nomor: number): Promise<SurahDetail> {
  const response = await fetch(`${API_BASE}/surat/${nomor}`);
  const data: ApiResponse<SurahDetail> = await response.json();
  return data.data;
}

export async function getTafsir(nomor: number): Promise<Tafsir> {
  const response = await fetch(`${API_BASE}/tafsir/${nomor}`);
  const data: ApiResponse<Tafsir> = await response.json();
  return data.data;
}

