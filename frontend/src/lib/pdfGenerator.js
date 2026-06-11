import jsPDF from "jspdf";
import logo from "@/assets/logo.png";

const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = src;
  });
};

const safe = (value, fallback = "N/A") => {
  return value === null || value === undefined || value === "" ? fallback : String(value);
};

const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 7) => {
  const lines = doc.splitTextToSize(safe(text, ""), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

const addNewPageIfNeeded = (doc, y) => {
  if (y > 270) {
    doc.addPage();
    return 20;
  }
  return y;
};

export const generatePrescriptionPDF = async (prescription) => {
  const doc = new jsPDF();

  const patient = prescription?.patient || prescription?.patientDetails || {};
  const doctor = prescription?.doctor || prescription?.doctorDetails || {};
  const medicines = prescription?.medicines || prescription?.items || [];

  const patientName =
    patient.name ||
    patient.fullName ||
    prescription?.patientName ||
    prescription?.name;

  const patientAge =
    patient.age ||
    prescription?.patientAge ||
    prescription?.age;

  const patientGender =
    patient.gender ||
    prescription?.patientGender ||
    prescription?.gender;

  const patientPhone =
    patient.phone ||
    patient.mobile ||
    prescription?.patientPhone ||
    prescription?.phone;

  const doctorName =
    doctor.name ||
    doctor.fullName ||
    prescription?.doctorName ||
    prescription?.createdByName;

  let y = 18;

  try {
    const logoBase64 = await loadImageAsBase64(logo);
    doc.addImage(logoBase64, "PNG", 20, 10, 18, 18);
  } catch {
    // Logo fail ho to PDF still generate hoga
  }

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HealthGrid Prescription", 42, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 42, 28);

  doc.line(20, 36, 190, 36);

  y = 48;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Details", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${safe(patientName)}`, 20, y);
  doc.text(`Age: ${safe(patientAge)}`, 110, y);

  y += 8;
  doc.text(`Gender: ${safe(patientGender)}`, 20, y);
  doc.text(`Phone: ${safe(patientPhone)}`, 110, y);

  y += 16;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Doctor Details", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Doctor: ${safe(doctorName)}`, 20, y);

  y += 16;

  if (prescription?.chiefComplaint) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Chief Complaint", 20, y);

    y += 9;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, prescription.chiefComplaint, 20, y, 170);
    y += 6;
  }

  if (prescription?.diagnosis) {
    y = addNewPageIfNeeded(doc, y);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis", 20, y);

    y += 9;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, prescription.diagnosis, 20, y, 170);
    y += 6;
  }

  y = addNewPageIfNeeded(doc, y);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Medicines", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  if (medicines.length === 0) {
    doc.text("No medicines added", 20, y);
    y += 8;
  } else {
    medicines.forEach((medicine, index) => {
      y = addNewPageIfNeeded(doc, y);

      const medicineName =
        medicine.name ||
        medicine.medicineName ||
        medicine.medicine_name ||
        medicine.label ||
        "Medicine";

      const dosage = medicine.dosage || "";
      const frequency = medicine.frequency || "";
      const duration = medicine.duration
        ? `${medicine.duration} ${medicine.durationUnit || "days"}`
        : "";

      doc.setFont("helvetica", "bold");
      y = addWrappedText(
        doc,
        `${index + 1}. ${medicineName}`,
        20,
        y,
        170
      );

      doc.setFont("helvetica", "normal");

      const doseLine = [dosage, frequency, duration].filter(Boolean).join(" | ");

      if (doseLine) {
        y = addWrappedText(doc, `   ${doseLine}`, 20, y, 170);
      }

      if (medicine.instructions) {
        y = addWrappedText(doc, `   Note: ${medicine.instructions}`, 20, y, 170);
      }

      y += 4;
    });
  }

  if (prescription?.advice) {
    y = addNewPageIfNeeded(doc, y + 4);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Advice", 20, y);

    y += 9;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, prescription.advice, 20, y, 170);
  }

  if (prescription?.followUpDate) {
    y = addNewPageIfNeeded(doc, y + 8);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Follow-up Date", 20, y);

    y += 9;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(safe(prescription.followUpDate), 20, y);
  }

  const fileName = `prescription-${safe(patientName, "patient")
    .replace(/\s+/g, "-")
    .toLowerCase()}.pdf`;

  doc.save(fileName);
};