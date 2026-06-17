import { FiPlus } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import MedicineCard from "./MedicineCard";

const TemplateFormDialog = ({
  open,
  form,
  errors,
  saving,
  editingTemplate,
  onCancel,
  onSave,
  onNameChange,
  onAdviceChange,
  onMedicineChange,
  onAddMedicine,
  onRemoveMedicine,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Input
              placeholder="Template Name (e.g. Viral Fever)"
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Medicines */}
          <div className="space-y-4">
            {form.medicines.map((med, index) => (
              <MedicineCard
                key={index}
                med={med}
                index={index}
                errors={errors}
                canRemove={form.medicines.length > 1}
                onChange={onMedicineChange}
                onRemove={onRemoveMedicine}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={onAddMedicine}
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
            onChange={(e) => onAdviceChange(e.target.value)}
          />

          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
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
  );
};

export default TemplateFormDialog;
