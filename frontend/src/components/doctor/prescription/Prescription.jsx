// src/components/doctor/prescription/Prescription.jsx

import { useState } from "react";

import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFilePdf,
  FaNotesMedical,
  FaPills,
  FaPlus,
  FaPrint,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import DrugWarningAlert from "@/components/doctor/DrugWarningAlert";

const FREQUENCY_OPTIONS = [
  "1-0-0",
  "0-0-1",
  "1-0-1",
  "1-1-1",
  "SOS",
  "TDS",
  "BD",
];

const Prescription = ({
  form,
  errors,
  loading,
  templates,
  selectedTemplate,
  results,
  activeSearch,
  onSubmit,
  onPrint,
  onFieldChange,
  onTemplateChange,
  onMedicineChange,
  onSelectMedicine,
  onAddMedicine,
  onRemoveMedicine,
  onSetActiveSearch,
}) => {
  const [warnings, setWarnings] = useState([]);

  const hasHighRiskWarning = warnings.some(
    (warning) => warning.severity === "HIGH",
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaFilePdf className="text-primary" />
          Prescription
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {templates.length > 0 && (
            <div className="space-y-2">
              <Label>Template</Label>

              <select
                value={selectedTemplate}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Load Template...</option>

                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
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
                  onFieldChange("chiefComplaint", e.target.value)
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
                onChange={(e) => onFieldChange("diagnosis", e.target.value)}
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

              <Button type="button" variant="outline" onClick={onAddMedicine}>
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
                        onClick={() => onRemoveMedicine(index)}
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
                              onMedicineChange(index, "name", e.target.value)
                            }
                            onFocus={() => onSetActiveSearch(index)}
                            onBlur={() =>
                              setTimeout(() => onSetActiveSearch(null), 200)
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
                                    onSelectMedicine(index, medicine)
                                  }
                                  className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
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
                            onMedicineChange(index, "dosage", e.target.value)
                          }
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Frequency</Label>

                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            onMedicineChange(
                              index,
                              "frequency",
                              e.target.value,
                            )
                          }
                          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {FREQUENCY_OPTIONS.map((frequency) => (
                            <option key={frequency} value={frequency}>
                              {frequency}
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
                            onMedicineChange(index, "duration", e.target.value)
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
                            onMedicineChange(
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

          <DrugWarningAlert
            medicines={form.medicines}
            onWarningsChange={setWarnings}
          />

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FaNotesMedical className="text-primary" />
              Advice
            </Label>

            <Textarea
              placeholder="Advice, rest, fluids, diet..."
              value={form.advice}
              onChange={(e) => onFieldChange("advice", e.target.value)}
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
              onChange={(e) => onFieldChange("followupDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-11"
            />
          </div>

          {hasHighRiskWarning && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <p>
                High risk interaction detected. Please review carefully before
                saving this prescription.
              </p>
            </div>
          )}

          {errors.submit && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.submit}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="submit" disabled={loading} className="h-12 w-full">
              <FaSave className="mr-2" />
              {loading ? "Saving..." : "Save & Generate PDF"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="h-12 w-full"
              onClick={onPrint}
            >
              <FaPrint className="mr-2" />
              {loading ? "Saving..." : "Save & Print"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Prescription;