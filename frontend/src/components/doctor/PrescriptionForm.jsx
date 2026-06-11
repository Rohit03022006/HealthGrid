import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaFilePdf,
  FaNotesMedical,
  FaPills,
  FaPlus,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import { createPrescriptionAPI } from "@/services/prescriptionService";
import { getTemplatesAPI } from "@/services/templateService";
import { useMedicineSearch } from "@/hooks/useMedicineSearch";
import { usePrescriptionPDF } from "@/hooks/usePrescriptionPDF";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FREQUENCY_OPTIONS = [
  "1-0-0",
  "0-0-1",
  "1-0-1",
  "1-1-1",
  "SOS",
  "TDS",
  "BD",
];

const EMPTY_MEDICINE = {
  name: "",
  dosage: "",
  frequency: "1-0-1",
  duration: "",
  instructions: "",
};

const PrescriptionForm = ({ token, onDone }) => {
  const [form, setForm] = useState({
    chiefComplaint: "",
    diagnosis: "",
    medicines: [{ ...EMPTY_MEDICINE }],
    advice: "",
    followupDate: "",
  });

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSearch, setActiveSearch] = useState(null);

  const { results, search, clear } = useMedicineSearch();
  const { downloadPDF } = usePrescriptionPDF();

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

  const handleLoadTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    setForm((prev) => ({
      ...prev,
      medicines: template.medicines.map((m) => ({ ...m })),
      advice: template.advice || "",
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.medicines];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, medicines: updated };
    });

    if (field === "name") {
      setActiveSearch(index);
      search(value);
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
      return { ...prev, medicines: updated };
    });

    setActiveSearch(null);
    clear();
  };

  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { ...EMPTY_MEDICINE }],
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

    form.medicines.forEach((med, i) => {
      if (!med.name.trim()) {
        newErrors[`med_${i}_name`] = "Medicine name required";
      }

      if (!med.duration.trim()) {
        newErrors[`med_${i}_duration`] = "Duration required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      tokenId: token.id,
      chiefComplaint: form.chiefComplaint.trim(),
      diagnosis: form.diagnosis.trim(),
      medicines: form.medicines,
      advice: form.advice.trim() || undefined,
      followupDate: form.followupDate || undefined,
    };

    try {
      const res = await createPrescriptionAPI(payload);

      downloadPDF({
        ...res.data,
        patientName: token.patient_name,
        patientAge: token.patient_age,
        tokenDisplay: token.token_display,
      });

      onDone();
    } catch (err) {
      setErrors({ submit: err?.message || "Failed to create prescription" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaFilePdf className="text-primary" />
          Prescription
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {templates.length > 0 && (
            <div className="space-y-2">
              <Label>Template</Label>
              <select
                onChange={(e) => handleLoadTemplate(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Load Template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Chief Complaint</Label>
              <Input
                placeholder="Chief Complaint"
                value={form.chiefComplaint}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    chiefComplaint: e.target.value,
                  }))
                }
                className="h-11"
              />
              {errors.chiefComplaint && (
                <p className="text-sm text-destructive">
                  {errors.chiefComplaint}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Input
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    diagnosis: e.target.value,
                  }))
                }
                className="h-11"
              />
              {errors.diagnosis && (
                <p className="text-sm text-destructive">{errors.diagnosis}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <FaPills className="text-primary" />
                  Medicines
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add medicines, dosage, frequency and duration.
                </p>
              </div>

              <Button type="button" variant="outline" onClick={addMedicine}>
                <FaPlus className="mr-2" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-4">
              {form.medicines.map((med, index) => (
                <Card key={index} className="shadow-none">
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">Medicine {index + 1}</Badge>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        disabled={form.medicines.length === 1}
                        className="text-destructive hover:text-destructive"
                      >
                        <FaTrash className="mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-4">
                      <div className="relative space-y-2 lg:col-span-2">
                        <Label>Medicine Name</Label>
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Medicine name"
                            value={med.name}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            onFocus={() => setActiveSearch(index)}
                            onBlur={() =>
                              setTimeout(() => setActiveSearch(null), 200)
                            }
                            className="h-11 pl-10"
                          />
                        </div>

                        {activeSearch === index && results.length > 0 && (
                          <Card className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto shadow-lg">
                            <CardContent className="p-1">
                              {results.map((medicine) => (
                                <button
                                  key={medicine.id}
                                  type="button"
                                  onMouseDown={() =>
                                    handleSelectMedicine(index, medicine)
                                  }
                                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                                >
                                  <span className="font-medium">
                                    {medicine.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {medicine.composition1}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {medicine.pack_size}
                                  </span>
                                </button>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {errors[`med_${index}_name`] && (
                          <p className="text-sm text-destructive">
                            {errors[`med_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "dosage",
                              e.target.value,
                            )
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "frequency",
                              e.target.value,
                            )
                          }
                          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {FREQUENCY_OPTIONS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          placeholder="Duration, e.g. 3 days"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="h-11"
                        />
                        {errors[`med_${index}_duration`] && (
                          <p className="text-sm text-destructive">
                            {errors[`med_${index}_duration`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Input
                          placeholder="Instructions optional"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value,
                            )
                          }
                          className="h-11"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FaNotesMedical className="text-primary" />
              Advice
            </Label>
            <Textarea
              placeholder="Advice, rest, fluids, diet..."
              value={form.advice}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, advice: e.target.value }))
              }
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary" />
              Follow-up Date
            </Label>
            <Input
              type="date"
              value={form.followupDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  followupDate: e.target.value,
                }))
              }
              min={new Date().toISOString().split("T")[0]}
              className="h-11"
            />
          </div>

          {errors.submit && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.submit}
            </div>
          )}

          <Button type="submit" disabled={loading} className="h-12 w-full">
            <FaSave className="mr-2" />
            {loading ? "Saving..." : "Save & Generate PDF"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrescriptionForm;
