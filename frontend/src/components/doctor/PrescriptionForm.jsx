import { useState, useEffect } from "react";

import { createPrescriptionAPI } from "@/services/prescriptionService";
import { getTemplatesAPI } from "@/services/templateService";

import { useMedicineSearch } from "@/hooks/useMedicineSearch";
import { usePrescriptionPDF } from "@/hooks/usePrescriptionPDF";
import { useAuth } from "@/hooks/useAuth";
import Prescription from "@/components/doctor/prescription/Prescription";

const EMPTY_MEDICINE = {
  name: "",
  dosage: "",
  frequency: "1-0-1",
  duration: "",
  instructions: "",
};

const createEmptyMedicine = () => ({ ...EMPTY_MEDICINE });

const PrescriptionForm = ({ token, onDone }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    chiefComplaint: "",
    diagnosis: "",
    medicines: [createEmptyMedicine()],
    advice: "",
    followupDate: "",
  });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSearch, setActiveSearch] = useState(null);

  const { results, search, clear } = useMedicineSearch();
  const { downloadPDF, printPDF } = usePrescriptionPDF();

  const tokenPatient = token?.patient || {};

  const patientName =
    token?.patient_name ||
    token?.patientName ||
    tokenPatient.name ||
    token?.name ||
    "";

  const patientAge =
    token?.patient_age || token?.patientAge || tokenPatient.age || "";

  const patientGender =
    token?.patient_gender || token?.patientGender || tokenPatient.gender || "";

  const patientCode =
    token?.patient_code ||
    token?.patientCode ||
    tokenPatient.patient_code ||
    tokenPatient.code ||
    "";

  const patientPhone =
    token?.patient_phone ||
    token?.patientPhone ||
    tokenPatient.phone ||
    tokenPatient.mobile ||
    "";

  const doctorName =
    token?.doctor_name ||
    token?.doctorName ||
    user?.name ||
    user?.fullName ||
    "";

  const tokenDisplay =
    token?.token_display || token?.tokenDisplay || token?.token || token?.id;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getTemplatesAPI();
        setTemplates(res.data || []);
      } catch {
        setTemplates([]);
      }
    };

    fetchTemplates();
  }, []);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleLoadTemplate = (templateId) => {
    if (!templateId) return;

    const template = templates.find(
      (item) => String(item.id) === String(templateId),
    );

    if (!template) return;

    setForm((prev) => ({
      ...prev,
      medicines: template.medicines?.length
        ? template.medicines.map((medicine) => ({ ...medicine }))
        : [createEmptyMedicine()],
      advice: template.advice || prev.advice,
    }));

    setSelectedTemplate("");
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    handleLoadTemplate(templateId);
  };

  const handleMedicineChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.medicines];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        medicines: updated,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [`med_${index}_${field}`]: "",
    }));

    if (field === "name") {
      if (value.trim()) {
        setActiveSearch(index);
        search(value);
      } else {
        setActiveSearch(null);
        clear();
      }
    }
  };

  const handleSelectMedicine = (index, medicine) => {
    setForm((prev) => {
      const updated = [...prev.medicines];

      updated[index] = {
        ...updated[index],
        name: medicine.name,
        dosage: medicine.dosage || "",
      };

      return {
        ...prev,
        medicines: updated,
      };
    });

    setActiveSearch(null);
    clear();
  };

  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, createEmptyMedicine()],
    }));
  };

  const removeMedicine = (index) => {
    if (form.medicines.length === 1) return;

    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Chief complaint required";
    }

    if (!form.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis required";
    }

    form.medicines.forEach((med, index) => {
      if (!med.name.trim()) {
        newErrors[`med_${index}_name`] = "Medicine name required";
      }

      if (!med.duration.trim()) {
        newErrors[`med_${index}_duration`] = "Duration required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitAndRender = async ({ printAfterSave = false } = {}) => {
    if (!validate()) return;

    setLoading(true);

    const payload = {
      tokenId: token.id,
      chiefComplaint: form.chiefComplaint.trim(),
      diagnosis: form.diagnosis.trim(),
      medicines: form.medicines.map((medicine) => ({
        name: medicine.name.trim(),
        dosage: medicine.dosage.trim(),
        frequency: medicine.frequency,
        duration: medicine.duration.trim(),
        instructions: medicine.instructions.trim(),
      })),
      advice: form.advice.trim() || undefined,
      followupDate: form.followupDate || undefined,
    };

    try {
      const res = await createPrescriptionAPI(payload);

      const saved = res.data?.data || res.data || {};
      const savedVisit = saved.visit || {};
      const savedPrescription = saved.prescription || {};

      const prescriptionForPdf = {
        ...saved,
        ...savedVisit,
        ...savedPrescription,
        patientName,
        patientAge,
        patientGender,
        patientCode,
        patientPhone,
        tokenDisplay,
        doctorName,
        createdAt:
          savedPrescription.created_at ||
          savedPrescription.createdAt ||
          savedVisit.visit_date ||
          savedVisit.created_at ||
          savedVisit.createdAt,
      };

      if (printAfterSave) {
        printPDF(prescriptionForPdf);
      } else {
        downloadPDF(prescriptionForPdf);
      }

      onDone();
    } catch (err) {
      setErrors({
        submit: err?.message || "Failed to create prescription",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitAndRender({ printAfterSave: false });
  };

  const handlePrint = async () => {
    await submitAndRender({ printAfterSave: true });
  };

  return (
    <div className="space-y-6">
      <Prescription
        form={form}
        errors={errors}
        loading={loading}
        templates={templates}
        selectedTemplate={selectedTemplate}
        results={results}
        activeSearch={activeSearch}
        onSubmit={handleSubmit}
        onPrint={handlePrint}
        onFieldChange={handleFieldChange}
        onTemplateChange={handleTemplateChange}
        onMedicineChange={handleMedicineChange}
        onSelectMedicine={handleSelectMedicine}
        onAddMedicine={addMedicine}
        onRemoveMedicine={removeMedicine}
        onSetActiveSearch={setActiveSearch}
      />
    </div>
  );
};

export default PrescriptionForm;
