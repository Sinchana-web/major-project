import type { HistoryRecord } from "../types/prediction";
import { formatBreedName, formatPercentage, formatDate } from "./formatters";

export const exportHistoryToCSV = (records: HistoryRecord[]): void => {
  if (!records || records.length === 0) return;

  const headers = [
    "Animal ID / ICAR Code",
    "Breed Name",
    "Species",
    "Gender / Role",
    "Confidence",
    "Native Region",
    "Scan Date",
    "Daily Milk Yield",
    "Fat Percentage",
    "Cultivation Utility",
    "Engine",
  ];

  const rows = records.map((r) => [
    `"${r.animal_id || ""}"`,
    `"${formatBreedName(r.breed)}"`,
    `"${r.species || ""}"`,
    `"${r.animal_gender || "Mature Livestock"}"`,
    `"${formatPercentage(r.confidence)}"`,
    `"${(r.region || "").replace(/"/g, '""')}"`,
    `"${formatDate(r.date)}"`,
    `"${r.average_daily_milk_litres || r.national_breed_profile?.dairy_profile?.average_daily_yield || "N/A"}"`,
    `"${r.fat_percentage || r.national_breed_profile?.dairy_profile?.fat_percentage || "N/A"}"`,
    `"${(r.cultivation_utility || r.national_breed_profile?.cultivation_profile?.cultivation_summary || "N/A").replace(/"/g, '""')}"`,
    `"${r.engine || "Gemini 2.5 Flash Vision"}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `pashu-scan-records-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
