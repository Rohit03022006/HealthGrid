import { useState, useEffect } from "react";

import {
  getTemplatesAPI,
  createTemplateAPI,
  updateTemplateAPI,
  deleteTemplateAPI,
} from "@/services/templateService";

import { useNavigate } from "react-router-dom";

import { FiPlus, FiHome, FiFileText } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import TemplateFormDialog from "@/components/templates/TemplateFormDialog";
import TemplateCard from "@/components/templates/TemplateCard";
import SyncStatusBadge from "@/components/common/SyncStatusBadge";

const createEmptyMedicine = () => ({
  name: "",
  dosage: "",
  frequency: "1-0-1",
  duration: "",
  instructions: "",
});

const createEmptyForm = () => ({
  name: "",
  medicines: [createEmptyMedicine()],
  advice: "",
});

const TemplateManagerPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(createEmptyForm);
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
    setForm(createEmptyForm());
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);

    setForm({
      name: template.name || "",
      medicines:
        template.medicines?.length > 0
          ? template.medicines.map((medicine) => ({ ...medicine }))
          : [createEmptyMedicine()],
      advice: template.advice || "",
    });

    setErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setForm(createEmptyForm());
    setErrors({});
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
    }));

    setErrors((prev) => ({
      ...prev,
      name: "",
    }));
  };

  const handleAdviceChange = (value) => {
    setForm((prev) => ({
      ...prev,
      advice: value,
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setForm((prev) => {
      const updatedMedicines = [...prev.medicines];

      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [field]: value,
      };

      return {
        ...prev,
        medicines: updatedMedicines,
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

    if (!form.name.trim()) {
      newErrors.name = "Template name required";
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      medicines: form.medicines.map((med) => ({
        name: med.name.trim(),
        dosage: med.dosage.trim(),
        frequency: med.frequency,
        duration: med.duration.trim(),
        instructions: med.instructions.trim(),
      })),
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

      setTemplates((prev) =>
        prev.filter((template) => template.id !== templateId),
      );
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
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FiFileText className="text-primary" />
              </span>
              My Templates
            </h1>

            <p className="mt-1 text-muted-foreground">
              Manage prescription templates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SyncStatusBadge />

            <Button
              variant="outline"
              className="h-11 gap-2"
              onClick={() => navigate("/doctor")}
            >
              <FiHome className="h-4 w-4" />
              Home
            </Button>

            <Button className="h-11 gap-2" onClick={handleCreate}>
              <FiPlus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </div>

        {/* Create / Edit Dialog */}
        <TemplateFormDialog
          open={showForm}
          form={form}
          errors={errors}
          saving={saving}
          editingTemplate={editingTemplate}
          onCancel={handleCancel}
          onSave={handleSave}
          onNameChange={handleNameChange}
          onAdviceChange={handleAdviceChange}
          onMedicineChange={handleMedicineChange}
          onAddMedicine={addMedicine}
          onRemoveMedicine={removeMedicine}
        />

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

              <p className="mt-2 text-muted-foreground">
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
              <TemplateCard
                key={template.id}
                template={template}
                deleting={deleting === template.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TemplateManagerPage;
