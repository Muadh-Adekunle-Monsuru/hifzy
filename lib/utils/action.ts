import { apiFetch } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAyahsByPages(
  startPage: number,
  endPage: number,
  reciter: number,
) {
  try {
    const response = await apiFetch(
      `${BASE_URL}/content/verses?recitation_id=${reciter}&page_start=${startPage}&page_end=${endPage}`,
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch ayahs by pages:", e);
    return [];
  }
}

export async function getAyahsBySurah(
  startSurah: number,
  endSurah: number,
  startVerse: number,
  endVerse: number,
  reciter: number,
) {
  try {
    const response = await apiFetch(
      `${BASE_URL}/content/verses?recitation_id=${reciter}&range_start=${startSurah}%3A${startVerse}&range_end=${endSurah}%3A${endVerse}`,
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch ayahs by surah:", e);
    return [];
  }
}

export async function saveRange(startRange: string, endRange: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const response = await apiFetch(`${BASE_URL}/goals`, {
      method: "POST",
      body: JSON.stringify({
        range_start: startRange,
        range_end: endRange,
        mushaf_id: 4,
        timezone: timeZone,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save range: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Failed to save range:", e);
  }
}
