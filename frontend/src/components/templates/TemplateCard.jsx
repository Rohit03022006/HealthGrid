import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TemplateCard = ({ template, deleting, onEdit, onDelete }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{template.name}</CardTitle>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
            >
              <FiEdit2 className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={() => onDelete(template.id)}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Medicines */}
        <div className="space-y-2">
          {template.medicines?.map((med, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-2 rounded-lg border p-3 text-sm"
            >
              <span className="font-medium">{med.name}</span>

              {med.dosage && (
                <span className="text-muted-foreground">{med.dosage}</span>
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
              <span className="font-medium">Advice:</span> {template.advice}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateCard;