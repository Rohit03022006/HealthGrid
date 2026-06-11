// src/lib/pdfGenerator.js
import jsPDF from "jspdf";

/*
  IMPORTANT:
  If your logo is inside public/logo.png, use:
  const LOGO_PATH = "/logo.png";

  If your logo is inside public/assets/logo.png, use:
  const LOGO_PATH = "/assets/logo.png";
*/

const LOGO_PATH = "/logo.png";

// A5 page setup
const PAGE_W = 148;
const PAGE_H = 210;

const MARGIN = 10;
const HEADER_H = 26;
const FOOTER_H = 10;

const CONTENT_TOP = 32;
const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 6;
const COL_W = PAGE_W - MARGIN * 2;

const FONT = "helvetica";

const COLORS = {
  black: [0, 0, 0],
  dark: [25, 25, 25],
  gray: [90, 90, 90],
  white: [255, 255, 255],
  light: [246, 246, 246],
  border: [185, 185, 185],
};

const FONTS = {
  title: 15,
  headerMeta: 9,
  sectionTitle: 8,
  body: 8.5,
  patientLabel: 8,
  patientValue: 8.5,
  tableHeader: 7.2,
  tableBody: 7.8,
  note: 7,
  footer: 7,
};

const SPACING = {
  sectionTitleGap: 5,
  bodyLineHeight: 4.2,
  bodyLineHeightSmall: 4,
  sectionGap: 5,

  patientBoxHeight: 28,
  patientLeftX: 3,
  patientRightX: 65,

  rxHeaderHeight: 7.5,
  rxHeaderGap: 10,

  tableRowLineHeight: 3.8,
  tableRowMinHeight: 10,
  tableRowGap: 2,
  tableNoteTopGap: 2.5,
  tableNoteLineHeight: 3.5,

  footerTextY: 5,
};

const TABLE = {
  headerWidths: {
    name: 48,
    dosage: 28,
    frequency: 24,
    duration: 28,
  },
  rowWidths: {
    name: 46,
    dosage: 26,
    frequency: 22,
    duration: 26,
  },
};

const WATERMARK = {
  width: 48,
  height: 48,
  opacity: 0.08,
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

const safe = (value, fallback = " -") =>
  hasValue(value) ? String(value) : fallback;

const pick = (...values) => values.find((value) => hasValue(value));

const getDeep = (source, path) =>
  path.split(".").reduce((current, key) => current?.[key], source);

const pickDeep = (source, paths = []) => {
  for (const path of paths) {
    const value = getDeep(source, path);
    if (hasValue(value)) return value;
  }

  return undefined;
};

const parseMaybeJson = (value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const formatDate = (value) => {
  if (!hasValue(value)) return new Date().toLocaleDateString("en-IN");

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return safe(value);

  return parsed.toLocaleDateString("en-IN");
};

const loadPublicImageAsBase64 = (src, opacity = WATERMARK.opacity) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;

      // Makes logo black and white
      ctx.filter = "grayscale(100%)";

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = src;
  });
};

const drawWatermarkLogo = (doc, logoBase64) => {
  if (!logoBase64) return;

  const logoW = WATERMARK.width;
  const logoH = WATERMARK.height;

  const x = (PAGE_W - logoW) / 2;
  const y = (PAGE_H - logoH) / 2;

  doc.addImage(logoBase64, "PNG", x, y, logoW, logoH);
};

const normalizeMedicines = (value) => {
  const parsed = parseMaybeJson(value);
  const array = Array.isArray(parsed) ? parsed : [];

  return array
    .map((medicine) => {
      if (!medicine || typeof medicine !== "object") return null;

      const nestedMedicine =
        medicine.medicine && typeof medicine.medicine === "object"
          ? medicine.medicine
          : {};

      const name = pick(
        medicine.name,
        medicine.medicineName,
        medicine.medicine_name,
        medicine.label,
        nestedMedicine.name,
        nestedMedicine.medicineName,
        nestedMedicine.medicine_name,
        nestedMedicine.label
      );

      const dosage = pick(
        medicine.dosage,
        medicine.dose,
        medicine.strength
      );

      const frequency = pick(
        medicine.frequency,
        medicine.freq,
        medicine.schedule
      );

      const durationValue = pick(
        medicine.duration,
        medicine.durationValue,
        medicine.duration_value
      );

      const durationUnit = pick(
        medicine.durationUnit,
        medicine.duration_unit,
        medicine.durationType,
        medicine.duration_type
      );

      const instructions = pick(
        medicine.instructions,
        medicine.note,
        medicine.notes,
        medicine.instruction,
        medicine.remark
      );

      const duration = hasValue(durationValue)
        ? `${durationValue}${hasValue(durationUnit) ? ` ${durationUnit}` : " days"}`
        : pick(medicine.durationText, medicine.duration_text);

      return {
        name,
        dosage,
        frequency,
        duration,
        instructions,
      };
    })
    .filter(Boolean);
};

const normalizePrescription = (input = {}) => {
  const root = input || {};

  const payload =
    root.data && typeof root.data === "object" ? root.data : {};

  const visit =
    root.visit ||
    root.visitData ||
    root.currentVisit ||
    payload.visit ||
    payload.visitData ||
    {};

  const prescription =
    root.prescription ||
    root.prescriptionData ||
    root.rx ||
    payload.prescription ||
    payload.prescriptionData ||
    payload.rx ||
    {};

  const patient =
    root.patient ||
    root.patientDetails ||
    payload.patient ||
    payload.patientDetails ||
    visit.patient ||
    prescription.patient ||
    {};

  const doctor =
    root.doctor ||
    root.doctorDetails ||
    payload.doctor ||
    payload.doctorDetails ||
    visit.doctor ||
    prescription.doctor ||
    {};

  const merged = {
    ...root,
    ...payload,
    ...visit,
    ...prescription,
  };

  const tokenDisplay = pick(
    root.tokenNumber,
    root.token_number,
    root.tokenNo,
    root.tokenDisplay,
    root.token_display,
    root.token,
    visit.tokenNumber,
    visit.token_number,
    visit.tokenNo,
    visit.token_display,
    visit.token,
    prescription.tokenNumber,
    prescription.token_number,
    prescription.tokenNo,
    prescription.token_display,
    prescription.token,
    merged.token_number,
    merged.tokenNo,
    merged.token,
    pickDeep(root, [
      "visit.tokenNumber",
      "visit.token_number",
      "prescription.tokenNumber",
      "prescription.token_number",
      "token.id",
    ])
  );

  const medicines = normalizeMedicines(
    pick(
      root.medicines,
      root.items,
      root.prescriptionItems,
      visit.medicines,
      visit.items,
      visit.prescriptionItems,
      prescription.medicines,
      prescription.items,
      prescription.prescriptionItems,
      merged.medicines,
      pickDeep(root, [
        "visit.medicines",
        "visit.items",
        "visit.prescriptionItems",
        "prescription.medicines",
        "prescription.items",
        "prescription.prescriptionItems",
        "rx.medicines",
        "rx.items",
      ])
    )
  );

  return {
    patientName: pick(
      root.patientName,
      root.patient_name,
      payload.patientName,
      payload.patient_name,
      patient.name,
      patient.fullName,
      patient.full_name,
      pickDeep(root, [
        "visit.patientName",
        "visit.patient_name",
        "visit.patient.name",
        "prescription.patientName",
        "prescription.patient_name",
        "prescription.patient.name",
        "patient.name",
        "patient.fullName",
      ])
    ),

    patientAge: pick(
      root.patientAge,
      root.patient_age,
      payload.patientAge,
      payload.patient_age,
      patient.age,
      pickDeep(root, [
        "visit.patientAge",
        "visit.patient_age",
        "visit.patient.age",
        "prescription.patientAge",
        "prescription.patient_age",
        "prescription.patient.age",
        "patient.age",
      ])
    ),

    patientGender: pick(
      root.patientGender,
      root.patient_gender,
      payload.patientGender,
      payload.patient_gender,
      patient.gender,
      pickDeep(root, [
        "visit.patientGender",
        "visit.patient_gender",
        "visit.patient.gender",
        "prescription.patientGender",
        "prescription.patient_gender",
        "prescription.patient.gender",
        "patient.gender",
      ])
    ),

    patientCode: pick(
      root.patientCode,
      root.patient_code,
      payload.patientCode,
      payload.patient_code,
      patient.patient_code,
      patient.code,
      patient.id,
      pickDeep(root, [
        "visit.patientCode",
        "visit.patient_code",
        "visit.patient.patient_code",
        "visit.patient.code",
        "visit.patient.id",
        "prescription.patientCode",
        "prescription.patient_code",
        "prescription.patient.patient_code",
        "prescription.patient.code",
        "prescription.patient.id",
        "patient.patient_code",
        "patient.code",
        "patient.id",
      ])
    ),

    patientPhone: pick(
      root.patientPhone,
      root.patient_phone,
      payload.patientPhone,
      payload.patient_phone,
      patient.phone,
      patient.mobile,
      pickDeep(root, [
        "visit.patientPhone",
        "visit.patient_phone",
        "visit.patient.phone",
        "visit.patient.mobile",
        "prescription.patientPhone",
        "prescription.patient_phone",
        "prescription.patient.phone",
        "prescription.patient.mobile",
        "patient.phone",
        "patient.mobile",
      ])
    ),

    doctorName: pick(
      root.doctorName,
      root.doctor_name,
      payload.doctorName,
      payload.doctor_name,
      doctor.name,
      doctor.fullName,
      doctor.full_name,
      pickDeep(root, [
        "visit.doctorName",
        "visit.doctor_name",
        "visit.doctor.name",
        "prescription.doctorName",
        "prescription.doctor_name",
        "prescription.doctor.name",
        "doctor.name",
        "doctor.fullName",
      ])
    ),

    chiefComplaint: pick(
      root.chiefComplaint,
      root.chief_complaint,
      root.complaint,
      payload.chiefComplaint,
      payload.chief_complaint,
      payload.complaint,
      visit.chiefComplaint,
      visit.chief_complaint,
      prescription.chiefComplaint,
      prescription.chief_complaint,
      merged.chiefComplaint,
      merged.chief_complaint,
      pickDeep(root, [
        "visit.chiefComplaint",
        "visit.chief_complaint",
        "prescription.chiefComplaint",
        "prescription.chief_complaint",
        "rx.chiefComplaint",
        "rx.chief_complaint",
      ])
    ),

    diagnosis: pick(
      root.diagnosis,
      root.disease,
      payload.diagnosis,
      payload.disease,
      visit.diagnosis,
      prescription.diagnosis,
      merged.diagnosis,
      pickDeep(root, [
        "visit.diagnosis",
        "prescription.diagnosis",
        "rx.diagnosis",
      ])
    ),

    advice: pick(
      root.advice,
      root.notes,
      payload.advice,
      payload.notes,
      visit.advice,
      visit.notes,
      prescription.advice,
      prescription.notes,
      merged.advice,
      pickDeep(root, [
        "visit.advice",
        "visit.notes",
        "prescription.advice",
        "prescription.notes",
        "rx.advice",
        "rx.notes",
      ])
    ),

    followupDate: pick(
      root.followUpDate,
      root.followupDate,
      root.followup_date,
      root.follow_up_date,
      payload.followUpDate,
      payload.followupDate,
      payload.followup_date,
      payload.follow_up_date,
      visit.followUpDate,
      visit.followupDate,
      visit.followup_date,
      visit.follow_up_date,
      prescription.followUpDate,
      prescription.followupDate,
      prescription.followup_date,
      prescription.follow_up_date,
      merged.followUpDate,
      merged.followup_date,
      pickDeep(root, [
        "visit.followupDate",
        "visit.followUpDate",
        "visit.followup_date",
        "visit.follow_up_date",
        "prescription.followupDate",
        "prescription.followUpDate",
        "prescription.followup_date",
        "prescription.follow_up_date",
        "rx.followupDate",
        "rx.followUpDate",
        "rx.followup_date",
        "rx.follow_up_date",
      ])
    ),

    createdAt: pick(
      root.createdAt,
      root.created_at,
      root.date,
      payload.createdAt,
      payload.created_at,
      payload.date,
      visit.createdAt,
      visit.created_at,
      prescription.createdAt,
      prescription.created_at,
      merged.createdAt,
      merged.created_at,
      pickDeep(root, [
        "visit.createdAt",
        "visit.created_at",
        "prescription.createdAt",
        "prescription.created_at",
        "rx.createdAt",
        "rx.created_at",
      ])
    ),

    tokenDisplay,
    medicines,
  };
};

const drawHeader = (doc, data) => {
  doc.setFillColor(...COLORS.white);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");

  doc.setTextColor(...COLORS.black);
  doc.setFont(FONT, "bold");
  doc.setFontSize(FONTS.title);
  doc.text("HealthGrid OPD", MARGIN, 9);

  doc.setFont(FONT, "normal");
  doc.setFontSize(FONTS.headerMeta);
  doc.text(`Doctor: ${safe(data.doctorName)}`, MARGIN, 17);

  doc.text(`Date: ${formatDate(data.createdAt)}`, PAGE_W - MARGIN, 9, {
    align: "right",
  });

  doc.text(`Token: ${safe(data.tokenDisplay)}`, PAGE_W - MARGIN, 17, {
    align: "right",
  });

  doc.setDrawColor(...COLORS.black);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, HEADER_H - 2, PAGE_W - MARGIN, HEADER_H - 2);
};

const drawPatientBox = (doc, data, y) => {
  const height = SPACING.patientBoxHeight;

  doc.setFillColor(...COLORS.light);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(MARGIN, y, COL_W, height, 2, 2, "FD");

  doc.setTextColor(...COLORS.black);
  doc.setFont(FONT, "bold");
  doc.setFontSize(FONTS.patientLabel);
  doc.text("PATIENT DETAILS", MARGIN + SPACING.patientLeftX, y + 5);

  doc.setFont(FONT, "normal");
  doc.setFontSize(FONTS.patientValue);

  const leftX = MARGIN + SPACING.patientLeftX;
  const rightX = MARGIN + SPACING.patientRightX;

  doc.text(`Name: ${safe(data.patientName)}`, leftX, y + 12);
  doc.text(`Age: ${safe(data.patientAge)}`, leftX, y + 18);
  doc.text(`Code: ${safe(data.patientCode)}`, leftX, y + 24);

  doc.text(`Gender: ${safe(data.patientGender)}`, rightX, y + 12);
  doc.text(`Phone: ${safe(data.patientPhone)}`, rightX, y + 18);

  return y + height + 5;
};

const addSectionTitle = (doc, title, y) => {
  doc.setFont(FONT, "bold");
  doc.setFontSize(FONTS.sectionTitle);
  doc.setTextColor(...COLORS.black);
  doc.text(title, MARGIN, y);

  return y + SPACING.sectionTitleGap;
};

const addWrappedParagraph = (
  doc,
  text,
  x,
  y,
  maxWidth,
  lineHeight = SPACING.bodyLineHeight,
  color = COLORS.dark
) => {
  const lines = doc.splitTextToSize(safe(text), maxWidth);
  doc.setFont(FONT, "normal");
  doc.setFontSize(FONTS.body);
  doc.setTextColor(...color);

  for (let i = 0; i < lines.length; i += 1) {
    if (y > CONTENT_BOTTOM) {
      return {
        y,
        breakNeeded: true,
        remainingLines: lines.slice(i),
      };
    }

    doc.text(lines[i], x, y);
    y += lineHeight;
  }

  return {
    y,
    breakNeeded: false,
    remainingLines: [],
  };
};

const addNewPage = (doc, data, logoBase64) => {
  doc.addPage();

  // Watermark first, then header/content
  drawWatermarkLogo(doc, logoBase64);
  drawHeader(doc, data);

  return CONTENT_TOP;
};

const drawMedicineTableHeader = (doc, y) => {
  const widths = TABLE.headerWidths;

  doc.setTextColor(...COLORS.black);
  doc.setFont(FONT, "bold");
  doc.setFontSize(FONTS.tableHeader);

  doc.text("MEDICINE", MARGIN, y);
  doc.text("DOSAGE", MARGIN + widths.name, y);
  doc.text("FREQUENCY", MARGIN + widths.name + widths.dosage, y);
  doc.text(
    "DURATION",
    MARGIN + widths.name + widths.dosage + widths.frequency,
    y
  );

  y += 2;

  doc.setDrawColor(...COLORS.border);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  return y + 4;
};

const measureMedicineRow = (doc, medicine) => {
  const widths = TABLE.rowWidths;

  const nameLines = doc.splitTextToSize(safe(medicine.name), widths.name);
  const dosageLines = doc.splitTextToSize(safe(medicine.dosage), widths.dosage);
  const frequencyLines = doc.splitTextToSize(
    safe(medicine.frequency),
    widths.frequency
  );
  const durationLines = doc.splitTextToSize(
    safe(medicine.duration),
    widths.duration
  );

  const noteLines = medicine.instructions
    ? doc.splitTextToSize(`Note: ${medicine.instructions}`, COL_W - 6)
    : [];

  const mainLinesCount = Math.max(
    nameLines.length,
    dosageLines.length,
    frequencyLines.length,
    durationLines.length
  );

  const mainHeight = mainLinesCount * SPACING.tableRowLineHeight + 5;
  const noteHeight =
    noteLines.length > 0
      ? SPACING.tableNoteTopGap +
        noteLines.length * SPACING.tableNoteLineHeight +
        2
      : 0;

  return {
    widths,
    nameLines,
    dosageLines,
    frequencyLines,
    durationLines,
    noteLines,
    mainLinesCount,
    mainHeight,
    noteHeight,
    height: Math.max(
      SPACING.tableRowMinHeight,
      mainHeight + noteHeight
    ),
  };
};

const drawMedicineRow = (doc, medicine, index, y) => {
  const metrics = measureMedicineRow(doc, medicine);

  if (y + metrics.height > CONTENT_BOTTOM) {
    return {
      y,
      pageBreak: true,
    };
  }

  if (index % 2 === 0) {
    doc.setFillColor(...COLORS.light);
    doc.setDrawColor(...COLORS.border);
    doc.rect(MARGIN, y, COL_W, metrics.height, "F");
  } else {
    doc.setDrawColor(...COLORS.border);
    doc.rect(MARGIN, y, COL_W, metrics.height);
  }

  const x1 = MARGIN;
  const x2 = MARGIN + metrics.widths.name;
  const x3 = x2 + metrics.widths.dosage;
  const x4 = x3 + metrics.widths.frequency;

  doc.setTextColor(...COLORS.black);
  doc.setFontSize(FONTS.tableBody);

  const drawLines = (lines, x, startY, options = {}) => {
    const {
      bold = false,
      lineHeight = SPACING.tableRowLineHeight,
    } = options;

    doc.setFont(FONT, bold ? "bold" : "normal");

    lines.forEach((line, lineIndex) => {
      doc.text(line, x, startY + lineIndex * lineHeight);
    });
  };

  const firstNameLines = metrics.nameLines.map((line, i) =>
    i === 0 ? `${index + 1}. ${line}` : line
  );

  const startY = y + 5;

  drawLines(firstNameLines, x1 + 1, startY, { bold: true });
  drawLines(metrics.dosageLines, x2 + 1, startY);
  drawLines(metrics.frequencyLines, x3 + 1, startY);
  drawLines(metrics.durationLines, x4 + 1, startY);

  doc.setDrawColor(...COLORS.border);
  doc.line(x2, y, x2, y + metrics.height);
  doc.line(x3, y, x3, y + metrics.height);
  doc.line(x4, y, x4, y + metrics.height);

  if (metrics.noteLines.length > 0) {
    const noteY = y + metrics.mainHeight + SPACING.tableNoteTopGap;

    doc.setFont(FONT, "normal");
    doc.setFontSize(FONTS.note);
    doc.setTextColor(...COLORS.gray);

    metrics.noteLines.forEach((line, lineIndex) => {
      doc.text(
        line,
        MARGIN + 2,
        noteY + lineIndex * SPACING.tableNoteLineHeight
      );
    });
  }

  return {
    y: y + metrics.height + SPACING.tableRowGap,
    pageBreak: false,
  };
};

const renderFooter = (doc) => {
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);

    doc.setFillColor(...COLORS.black);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");

    doc.setTextColor(...COLORS.white);
    doc.setFont(FONT, "normal");
    doc.setFontSize(FONTS.footer);

    doc.text(
      "Generated by HealthGrid OPD Management System",
      PAGE_W / 2,
      PAGE_H - SPACING.footerTextY,
      {
        align: "center",
      }
    );
  }
};

export const generatePrescriptionPDF = async (
  prescription = {},
  options = {}
) => {
  console.log("[HealthGrid PDF] Raw prescription payload:", prescription);

  const data = normalizePrescription(prescription);

  console.log("[HealthGrid PDF] Normalized prescription data:", data);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  let logoBase64 = null;

  try {
    logoBase64 = await loadPublicImageAsBase64(
      LOGO_PATH,
      WATERMARK.opacity
    );
  } catch (error) {
    console.warn("[HealthGrid PDF] Logo load failed:", error);
  }

  // Watermark first, then header/content
  drawWatermarkLogo(doc, logoBase64);
  drawHeader(doc, data);

  let y = CONTENT_TOP;

  y = drawPatientBox(doc, data, y);

  y = addSectionTitle(doc, "CHIEF COMPLAINT", y);

  if (y > CONTENT_BOTTOM - 16) {
    y = addNewPage(doc, data, logoBase64);
  }

  const chiefComplaintResult = addWrappedParagraph(
    doc,
    data.chiefComplaint,
    MARGIN,
    y,
    COL_W,
    SPACING.bodyLineHeight,
    COLORS.dark
  );

  y = chiefComplaintResult.y + SPACING.sectionGap;

  if (chiefComplaintResult.breakNeeded) {
    y = addNewPage(doc, data, logoBase64);

    const retry = addWrappedParagraph(
      doc,
      chiefComplaintResult.remainingLines.join(" "),
      MARGIN,
      y,
      COL_W,
      SPACING.bodyLineHeight,
      COLORS.dark
    );

    y = retry.y + SPACING.sectionGap;
  }

  if (y > CONTENT_BOTTOM - 16) {
    y = addNewPage(doc, data, logoBase64);
  }

  y = addSectionTitle(doc, "DIAGNOSIS", y);

  const diagnosisResult = addWrappedParagraph(
    doc,
    data.diagnosis,
    MARGIN,
    y,
    COL_W,
    SPACING.bodyLineHeight,
    COLORS.dark
  );

  y = diagnosisResult.y + SPACING.sectionGap;

  if (diagnosisResult.breakNeeded) {
    y = addNewPage(doc, data, logoBase64);

    const retry = addWrappedParagraph(
      doc,
      diagnosisResult.remainingLines.join(" "),
      MARGIN,
      y,
      COL_W,
      SPACING.bodyLineHeight,
      COLORS.dark
    );

    y = retry.y + SPACING.sectionGap;
  }

  if (y > CONTENT_BOTTOM - 14) {
    y = addNewPage(doc, data, logoBase64);
  }

  y = drawRxHeader(doc, y);
  y = drawMedicineTableHeader(doc, y);

  if (!Array.isArray(data.medicines) || data.medicines.length === 0) {
    doc.setTextColor(...COLORS.gray);
    doc.setFont(FONT, "normal");
    doc.setFontSize(FONTS.tableBody);
    doc.text("No medicines added", MARGIN, y + 3);
    y += 10;
  } else {
    data.medicines.forEach((medicine, index) => {
      let row = drawMedicineRow(doc, medicine, index, y);

      if (row.pageBreak) {
        y = addNewPage(doc, data, logoBase64);
        y = drawRxHeader(doc, y);
        y = drawMedicineTableHeader(doc, y);

        row = drawMedicineRow(doc, medicine, index, y);
      }

      y = row.y;
    });
  }

  if (y > CONTENT_BOTTOM - 16) {
    y = addNewPage(doc, data, logoBase64);
  }

  if (hasValue(data.advice)) {
    y = addSectionTitle(doc, "ADVICE", y);

    const adviceResult = addWrappedParagraph(
      doc,
      data.advice,
      MARGIN,
      y,
      COL_W,
      SPACING.bodyLineHeightSmall,
      COLORS.dark
    );

    y = adviceResult.y + SPACING.sectionGap;

    if (adviceResult.breakNeeded) {
      y = addNewPage(doc, data, logoBase64);
      y = addSectionTitle(doc, "ADVICE", y);

      const retry = addWrappedParagraph(
        doc,
        adviceResult.remainingLines.join(" "),
        MARGIN,
        y,
        COL_W,
        SPACING.bodyLineHeightSmall,
        COLORS.dark
      );

      y = retry.y + SPACING.sectionGap;
    }
  }

  if (hasValue(data.followupDate)) {
    if (y > CONTENT_BOTTOM - 10) {
      y = addNewPage(doc, data, logoBase64);
    }

    doc.setTextColor(...COLORS.black);
    doc.setFont(FONT, "bold");
    doc.setFontSize(FONTS.patientValue);

    doc.text(`Follow-up: ${formatDate(data.followupDate)}`, MARGIN, y);
  }

  renderFooter(doc);

  const cleanPatientName = safe(data.patientName, "patient")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const cleanToken = safe(data.tokenDisplay, "token").replace(/\s+/g, "-");

  const filename = `healthgrid_opd_${cleanPatientName}_${cleanToken}.pdf`;

  if (options.print) {
    const blob = doc.output("blob");
    const printUrl = URL.createObjectURL(blob);
    const printWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printWindow) {
      doc.save(filename);
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            html, body {
              margin: 0;
              height: 100%;
              background: #fff;
            }

            iframe {
              border: 0;
              width: 100vw;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <iframe id="healthgrid-pdf-frame" src="${printUrl}"></iframe>
        </body>
      </html>
    `);

    printWindow.document.close();

    const frame = printWindow.document.getElementById("healthgrid-pdf-frame");

    if (frame) {
      frame.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      };
    }

    setTimeout(() => URL.revokeObjectURL(printUrl), 60000);
    return;
  }

  doc.save(filename);
};