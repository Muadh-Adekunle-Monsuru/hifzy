import { getToken } from "./auth";

export async function getAyahsByPages(
  startPage: number,
  endPage: number,
  reciter: number,
) {
  const token = getToken();
  try {
    const response = await fetch(
      `https://quran-be-59779bf2.fastapicloud.dev/content/verses?recitation_id=${reciter}&page_start=${startPage}&page_end=${endPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch data from the server, please re-login");
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
  const token = getToken();
  try {
    const response = await fetch(
      `https://quran-be-59779bf2.fastapicloud.dev/content/verses?recitation_id=${reciter}&range_start=${startSurah}%3A${startVerse}&range_end=${endSurah}%3A${endVerse}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch data from the server, please re-login");
    return [];
  }
}
