import { jsPDF } from "jspdf";
import type { PredictionResult } from "../types/prediction";
import { formatBreedName, formatPercentage, formatDate } from "./formatters";

export const generatePassportPDF = (
  result: PredictionResult,
  _mediaUrl?: string
): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const breedFormatted = formatBreedName(result.breed);

  // Background Header - Deep Emerald Banner
  doc.setFillColor(20, 83, 45); // #14532d
  doc.rect(0, 0, pageWidth, 42, "F");

  // Gold accent line
  doc.setFillColor(217, 119, 6); // #d97706
  doc.rect(0, 42, pageWidth, 2.5, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PASHU PEHCHAAN • DIGITAL LIVESTOCK PASSPORT", pageWidth / 2, 16, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "ICAR - National Bureau of Animal Genetic Resources (NBAGR) Descriptor Standard",
    pageWidth / 2,
    24,
    { align: "center" }
  );

  doc.setFontSize(8);
  doc.setTextColor(209, 250, 229);
  doc.text(
    "Authentic Indigenous Livestock Identification & Morphological Record",
    pageWidth / 2,
    31,
    { align: "center" }
  );

  // Watermark Seal Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, pageWidth - 28, 26, 3, 3, "FD");

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Official Accession Code: ${result.animal_id}`, 20, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Evaluation Date: ${formatDate(result.date)}`, 20, 71);
  doc.text(`Diagnostic Engine: ${result.engine || "Gemini 2.5 Flash Vision"}`, 120, 71);

  // Primary Identification Box
  let y = 86;
  doc.setFillColor(240, 253, 244); // light emerald
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, pageWidth - 28, 38, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 83, 45);
  doc.text(breedFormatted, 20, y + 12);

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Species: ${result.species}`, 20, y + 21);
  doc.text(`Role / Gender: ${result.animal_gender || "Mature Livestock"}`, 85, y + 21);
  doc.text(`Confidence: ${formatPercentage(result.confidence)}`, 150, y + 21);

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Geographic Tract: ${result.region || "Indigenous Distribution across India"}`, 20, y + 30);

  // 100% Resemblance Section
  y += 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("OBSERVED BREED RESEMBLANCE BREAKDOWN (100% SUM)", 14, y);

  y += 5;
  const resemblances = result.breed_resemblances || [];
  if (resemblances.length > 0) {
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, "FD");

    let subY = y + 8;
    resemblances.slice(0, 3).forEach((r) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(20, 83, 45);
      doc.text(`${r.breed}: ${r.percentage}%`, 20, subY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const reason = r.reasoning ? (r.reasoning.length > 70 ? r.reasoning.substring(0, 68) + "..." : r.reasoning) : "Phenotypic traits match standard";
      doc.text(reason, 75, subY);
      subY += 7;
    });
    y += 34;
  } else {
    y += 6;
  }

  // Biological Anatomy & Utilities Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("BIOLOGICAL ATTRIBUTES & AGRARIAN UTILITY", 14, y);

  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, y, pageWidth - 28, 52, 2, 2, "FD");

  const col1X = 20;
  const col2X = 110;
  let bioY = y + 8;

  // Row 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Horn Morphology:", col1X, bioY);
  doc.text("Dairy Yield (Cows):", col2X, bioY);

  bioY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const hornTxt = result.horn_traits || result.national_breed_profile?.biological_traits.horn_morphology || "Standard indigenous curvature";
  doc.text(hornTxt.length > 50 ? hornTxt.substring(0, 48) + "..." : hornTxt, col1X, bioY);

  const milkTxt = result.average_daily_milk_litres || result.national_breed_profile?.dairy_profile.average_daily_yield || "3 - 15 Litres/day";
  doc.text(milkTxt, col2X, bioY);

  // Row 2
  bioY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Coat & Pigmentation:", col1X, bioY);
  doc.text("Milk Fat %:", col2X, bioY);

  bioY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const coatTxt = result.coat_and_build || result.national_breed_profile?.biological_traits.coat_and_pigmentation || "High natural solar reflectance";
  doc.text(coatTxt.length > 50 ? coatTxt.substring(0, 48) + "..." : coatTxt, col1X, bioY);

  const fatTxt = result.fat_percentage || result.national_breed_profile?.dairy_profile.fat_percentage || "4.5% - 8.0%";
  doc.text(fatTxt, col2X, bioY);

  // Row 3
  bioY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Draught & Cultivation Power:", col1X, bioY);
  doc.text("Heat & Disease Tolerance:", col2X, bioY);

  bioY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const cultTxt = result.cultivation_utility || result.national_breed_profile?.cultivation_profile.cultivation_summary || "Sturdy ploughing and agricultural carting";
  doc.text(cultTxt.length > 50 ? cultTxt.substring(0, 48) + "..." : cultTxt, col1X, bioY);
  doc.text("Natural resistance to tropical parasites & ticks", col2X, bioY);

  // Institutional Verification Footer
  y += 60;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("OFFICIAL LIVESTOCK REGISTRY & ZERO-OWNER PRIVACY NOTICE", 20, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This certificate verifies the visual genetics and ICAR-NBAGR morphological profile of the animal.",
    20,
    y + 13
  );
  doc.text(
    "No personal farmer or ownership data is collected or stored on external servers, protecting producer privacy.",
    20,
    y + 18
  );

  // Bottom Stamp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Verified by Pashu Pehchaan Agritech Engine", pageWidth - 75, y + 18);

  // Download PDF
  const cleanId = (result.animal_id || "animal").replace(/[^a-zA-Z0-9-_]/g, "_");
  doc.save(`pashu-passport-${cleanId}.pdf`);
};

export const sharePassportRecord = async (
  result: PredictionResult,
  onNotify: (msg: string) => void
): Promise<void> => {
  const breedFormatted = formatBreedName(result.breed);
  const text = `Digital Livestock Passport - ${breedFormatted} (${result.species}) | ICAR Code: ${result.animal_id} | Pashu Pehchaan`;
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Pashu Pehchaan - ${breedFormatted}`,
        text,
        url,
      });
      onNotify("Passport shared successfully!");
      return;
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.warn("Share API fallback:", e);
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    onNotify("Passport link copied to clipboard!");
  } catch (err) {
    onNotify(`Record: ${breedFormatted} (${result.animal_id})`);
  }
};
