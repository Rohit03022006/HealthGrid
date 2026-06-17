// src/components/doctor/DrugWarningAlert.jsx

import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiLoader,
} from "react-icons/fi";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";

import useDrugInteraction from "@/hooks/useDrugInteraction";
import { useEffect } from "react";

const SEVERITY_CONFIG = {
  HIGH: {
    Icon: FiAlertTriangle,
    label: "Dangerous Interaction",
    alertClass: "border-destructive/50 bg-destructive/10",
    iconClass: "text-destructive",
    badgeClass: "bg-destructive text-destructive-foreground",
  },
  MEDIUM: {
    Icon: FiAlertCircle,
    label: "Caution Required",
    alertClass: "border-yellow-500/40 bg-yellow-500/10",
    iconClass: "text-yellow-600 dark:text-yellow-400",
    badgeClass: "bg-yellow-500 text-white",
  },
  LOW: {
    Icon: FiInfo,
    label: "Minor Interaction",
    alertClass: "border-blue-500/40 bg-blue-500/10",
    iconClass: "text-blue-600 dark:text-blue-400",
    badgeClass: "bg-blue-500 text-white",
  },
};

const DrugWarningAlert = ({ medicines = [], onWarningsChange }) => {
  const { warnings = [], checking } = useDrugInteraction(medicines);

  useEffect(() => {
    onWarningsChange?.(warnings);
  }, [warnings, onWarningsChange]);

  if (checking) {
    return (
      <Alert className="border-muted bg-muted/40">
        <FiLoader className="h-4 w-4 animate-spin" />

        <AlertTitle>Checking drug interactions</AlertTitle>

        <AlertDescription>
          Please wait while we check selected medicines.
        </AlertDescription>
      </Alert>
    );
  }

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => {
        const config = SEVERITY_CONFIG[warning.severity] || SEVERITY_CONFIG.LOW;

        const Icon = config.Icon;

        return (
          <Alert
            key={`${warning.severity}-${index}`}
            className={config.alertClass}
          >
            <Icon className={`h-5 w-5 ${config.iconClass}`} />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <AlertTitle className="text-base font-semibold">
                  {config.label}
                </AlertTitle>

                <Badge className={config.badgeClass}>{warning.severity}</Badge>
              </div>

              <AlertDescription className="space-y-1 text-sm leading-relaxed">
                <p>{warning.message}</p>

                {warning.source && (
                  <p className="text-xs text-muted-foreground">
                    Source: {warning.source}
                  </p>
                )}
              </AlertDescription>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};

export default DrugWarningAlert;
