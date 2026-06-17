import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiFileText,
  FiHome,
  FiLoader,
  FiPlus,
} from "react-icons/fi";

import {
  getTemplatesAPI,
  createTemplateAPI,
  updateTemplateAPI,
  deleteTemplateAPI,
} from "@/services/templateService";

import TemplateFormDialog from "@/components/templates/TemplateFormDialog";
import TemplateCard from "@/components/templates/TemplateCard";
import SyncStatusBadge from "@/components/common/SyncStatusBadge";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const containerAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpAnimation = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const TemplateManagerPage = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(() => createEmptyForm());
  const [errors, setErrors] = useState({});

  const fetchTemplates = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getTemplatesAPI();
      setTemplates(res.data || []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTemplates();
  }, [fetchTemplates]);

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={fadeUpAnimation}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FiFileText className="text-primary" />
              </span>
              My Templates
            </h1>

            <p className="mt-1 text-muted-foreground">
              Manage reusable prescription templates for faster OPD workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
        </motion.div>

        {/* Info Card */}
        <motion.div variants={fadeUpAnimation}>
          <Card className="border-primary/10 bg-primary/5 shadow-none">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                  <FiFileText className="text-primary" />
                </span>

                <div>
                  <p className="font-medium">Prescription Template Library</p>
                  <p className="text-sm text-muted-foreground">
                    Save common medicine combinations and reuse them while
                    writing prescriptions.
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit rounded-full">
                {templates.length} Templates
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

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
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={fadeUpAnimation}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -12,
              }}
            >
              <Card className="border-primary/10 bg-background/80 shadow-sm backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                  <FiLoader className="h-8 w-8 animate-spin text-primary" />

                  <p className="text-sm font-medium text-muted-foreground">
                    Loading templates...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : templates.length === 0 ? (
            <motion.div
              key="empty"
              variants={fadeUpAnimation}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -12,
              }}
            >
              <Card className="border-dashed border-primary/20 bg-background/80 shadow-none backdrop-blur">
                <CardContent className="flex min-h-[360px] items-center justify-center p-6 text-center">
                  <div className="max-w-sm">
                    <motion.span
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                    >
                      <FiFileText className="text-2xl text-primary" />
                    </motion.span>

                    <h3 className="text-xl font-semibold">No templates yet</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first prescription template and speed up
                      daily OPD prescriptions.
                    </p>

                    <Button className="mt-5 gap-2" onClick={handleCreate}>
                      <FiPlus className="h-4 w-4" />
                      Create Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -12,
              }}
              className="grid gap-4"
            >
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={fadeUpAnimation}
                  whileHover={{
                    y: -2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                >
                  <TemplateCard
                    template={template}
                    deleting={deleting === template.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
};

export default TemplateManagerPage;