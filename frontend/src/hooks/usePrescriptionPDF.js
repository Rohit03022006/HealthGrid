import { useCallback } from "react";
import { generatePrescriptionPDF } from "@/lib/pdfGenerator";

export const usePrescriptionPDF = () => {

  const downloadPDF = useCallback((prescriptionData) => {
    generatePrescriptionPDF(prescriptionData);
  }, []);

  const printPDF = useCallback((prescriptionData) => {
    generatePrescriptionPDF(prescriptionData, { print: true });
  }, []);

  return { downloadPDF, printPDF };
};