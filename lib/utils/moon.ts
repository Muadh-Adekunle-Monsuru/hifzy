// utils/getMoonData.ts
import { gregorianToHijri } from "@tabby_ai/hijri-converter";

export function getMoonData() {
  const date = new Date();
  const hijri = gregorianToHijri({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });

  const monthNames = [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Ula",
    "Jumada al-Akhira",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah",
  ];

  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);

  // Simple moon phase calculation (0-28 days)
  const day = hijri.day;
  let phase = "New Moon";
  let icon = "🌑";

  if (day > 1 && day < 7) {
    phase = "Waxing Crescent";
    icon = "🌙";
  } else if (day >= 7 && day < 14) {
    phase = "First Quarter";
    icon = "🌓";
  } else if (day >= 14 && day < 16) {
    phase = "Full Moon";
    icon = "🌕";
  } else if (day >= 16 && day < 22) {
    phase = "Waning Gibbous";
    icon = "🌖";
  } else if (day >= 22) {
    phase = "Waning Crescent";
    icon = "🌘";
  }

  return {
    dayOfWeek,
    hijriDay: hijri.day,
    hijriMonth: monthNames[hijri.month - 1],
    hijriYear: hijri.year,
    phase,
    icon,
  };
}
