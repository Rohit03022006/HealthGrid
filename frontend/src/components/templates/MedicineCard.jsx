import { FiTrash2 } from "react-icons/fi";

import { FREQUENCY_OPTIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MedicineCard = ({
  med,
  index,
  errors,
  canRemove,
  onChange,
  onRemove,
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Medicine {index + 1}
          </CardTitle>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
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
              Medicine Name <span className="text-destructive">*</span>
            </Label>

            <Input
              id={`med-name-${index}`}
              placeholder="e.g. Paracetamol"
              value={med.name}
              onChange={(e) => onChange(index, "name", e.target.value)}
              className={errors[`med_${index}_name`] ? "border-destructive" : ""}
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
              onChange={(e) => onChange(index, "dosage", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Frequency & Duration */}
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
              onValueChange={(value) => onChange(index, "frequency", value)}
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
              onChange={(e) => onChange(index, "duration", e.target.value)}
              className={
                errors[`med_${index}_duration`] ? "border-destructive" : ""
              }
            />

            {errors[`med_${index}_duration`] && (
              <p className="text-sm text-destructive">
                {errors[`med_${index}_duration`]}
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
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
            onChange={(e) => onChange(index, "instructions", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;