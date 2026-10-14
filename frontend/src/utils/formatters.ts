/**
 * Converts backend breed string with underscores to clean readable title (e.g. Malnad_Gidda -> Malnad Gidda)
 */
export const formatBreedName = (breed: string): string => {
  if (!breed) return "";
  return breed.replace(/_/g, " ").trim();
};

/**
 * Converts confidence value between 0 and 1 into percentage string (e.g. 0.9685 -> 96.85%)
 */
export const formatPercentage = (val: number): string => {
  if (val === undefined || val === null || isNaN(val)) return "0.00%";
  const pct = val > 1 ? val : val * 100;
  return `${pct.toFixed(2)}%`;
};

/**
 * Formats YYYY-MM-DD or ISO date string into human readable format (e.g. 2026-09-15 -> 15 September 2026)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Formats byte counts into KB/MB string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
