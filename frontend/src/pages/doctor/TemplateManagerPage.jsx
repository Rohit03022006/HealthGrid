import { useState, useEffect } from "react";

import {
  getTemplatesAPI,
  createTemplateAPI,
  updateTemplateAPI,
  deleteTemplateAPI,
} from "@/services/templateService";

import { FREQUENCY_OPTIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Label } from "@/components/ui/label";

const EMPTY_MEDICINE = {
  name: "",
  dosage: "",
  frequency: "1-0-1",
  duration: "",
  instructions: "",
};

const EMPTY_FORM = {
  name: "",
  medicines: [{ ...EMPTY_MEDICINE }],
  advice: "",
};

const TemplateManagerPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [editingTemplate, setEditingTemplate] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState({});

  const fetchTemplates = async () => {
    setLoading(true);

    try {
      const res = await getTemplatesAPI();

      setTemplates(res.data || []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTemplates();
  }, []);

  const handleCreate = () => {
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);

    setForm({
      name: template.name,
      medicines: template.medicines.map((m) => ({
        ...m,
      })),
      advice: template.advice || "",
    });

    setErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setErrors({});
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

    if (!form.name.trim()) {
      newErrors.name = "Template name required";
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      medicines: form.medicines,
      advice: form.advice.trim() || undefined,
    };

    try {
      if (editingTemplate) {
        await updateTemplateAPI(editingTemplate.id, payload);
      } else {
        await createTemplateAPI(payload);
      }

      await fetchTemplates();

      handleCancel();
    } catch (err) {
      if (err?.message?.includes("already exists")) {
        setErrors({
          name: "Template name already exists",
        });
      } else {
        setErrors({
          submit: err?.message || "Failed to save template",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm("Delete this template?")) return;

    setDeleting(templateId);

    try {
      await deleteTemplateAPI(templateId);

      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Templates</h1>

            <p className="text-muted-foreground">
              Manage prescription templates
            </p>
          </div>

          <Button onClick={handleCreate}>
            <FiPlus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog
          open={showForm}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
        >
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Edit Template" : "Create Template"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Template Name */}
              <div className="space-y-2">
                <Input
                  placeholder="Template Name (e.g. Viral Fever)"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />

                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Medicines */}
              <div className="space-y-4">
                {form.medicines.map((med, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Medicine {index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedicine(index)}
                          disabled={form.medicines.length === 1}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Row 1: Name & Dosage */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`med-name-${index}`}
                            className="text-sm font-medium"
                          >
                            Medicine Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`med-name-${index}`}
                            placeholder="e.g. Paracetamol"
                            value={med.name}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            className={
                              errors[`med_${index}_name`]
                                ? "border-destructive"
                                : ""
                            }
                          />
                          {errors[`med_${index}_name`] && (
                            <p className="text-sm text-destructive">
                              {errors[`med_${index}_name`]}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`med-dosage-${index}`}
                            className="text-sm font-medium"
                          >
                            Dosage
                          </Label>
                          <Input
                            id={`med-dosage-${index}`}
                            placeholder="e.g. 500mg"
                            value={med.dosage}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "dosage",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Row 2: Frequency, Duration */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`med-frequency-${index}`}
                            className="text-sm font-medium"
                          >
                            Frequency
                          </Label>
                          <Select
                            value={med.frequency}
                            onValueChange={(value) =>
                              handleMedicineChange(index, "frequency", value)
                            }
                          >
                            <SelectTrigger id={`med-frequency-${index}`}>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>

                            <SelectContent>
                              {FREQUENCY_OPTIONS.map((f) => (
                                <SelectItem key={f.value} value={f.value}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`med-duration-${index}`}
                            className="text-sm font-medium"
                          >
                            Duration <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`med-duration-${index}`}
                            placeholder="e.g. 5 days"
                            value={med.duration}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "duration",
                                e.target.value,
                              )
                            }
                            className={
                              errors[`med_${index}_duration`]
                                ? "border-destructive"
                                : ""
                            }
                          />
                          {errors[`med_${index}_duration`] && (
                            <p className="text-sm text-destructive">
                              {errors[`med_${index}_duration`]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`med-instructions-${index}`}
                          className="text-sm font-medium"
                        >
                          Instructions
                        </Label>
                        <Input
                          id={`med-instructions-${index}`}
                          placeholder="e.g. Take after meals"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addMedicine}
                  className="w-full border-dashed hover:border-solid"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Medicine
                </Button>
              </div>

              {/* Advice */}
              <Textarea
                rows={4}
                placeholder="Advice"
                value={form.advice}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    advice: e.target.value,
                  }))
                }
              />

              {errors.submit && (
                <p className="text-sm text-destructive">{errors.submit}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingTemplate
                      ? "Update Template"
                      : "Create Template"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Templates List */}
        {loading ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Loading templates...</p>
            </CardContent>
          </Card>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <h3 className="text-lg font-semibold">No templates yet</h3>

              <p className="text-muted-foreground mt-2">
                Create your first prescription template.
              </p>

              <Button className="mt-4" onClick={handleCreate}>
                <FiPlus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{template.name}</CardTitle>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleting === template.id}
                        onClick={() => handleDelete(template.id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Medicines */}
                  <div className="space-y-2">
                    {template.medicines?.map((med, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap gap-2 rounded-lg border p-3 text-sm"
                      >
                        <span className="font-medium">{med.name}</span>

                        {med.dosage && (
                          <span className="text-muted-foreground">
                            {med.dosage}
                          </span>
                        )}

                        <span className="rounded bg-muted px-2 py-1 text-xs">
                          {med.frequency}
                        </span>

                        <span className="rounded bg-muted px-2 py-1 text-xs">
                          {med.duration}
                        </span>

                        {med.instructions && (
                          <span className="text-muted-foreground">
                            • {med.instructions}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Advice */}
                  {template.advice && (
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-sm">
                        <span className="font-medium">Advice:</span>{" "}
                        {template.advice}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TemplateManagerPage;
