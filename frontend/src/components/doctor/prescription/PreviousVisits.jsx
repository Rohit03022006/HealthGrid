// src/components/doctor/prescription/PreviousVisits.jsx

import { FaCalendarAlt, FaHistory, FaNotesMedical } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PreviousVisits = ({ visits = [] }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaHistory className="text-primary" />
          Previous Visits
        </CardTitle>
      </CardHeader>

      <CardContent>
        {visits.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No previous visits found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit, index) => (
              <div
                key={visit.id || index}
                className="rounded-lg border bg-muted/20 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <FaNotesMedical className="text-primary" />
                      {visit.diagnosis || "Diagnosis not added"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {visit.chief_complaint ||
                        visit.chiefComplaint ||
                        "No complaint available"}
                    </p>
                  </div>

                  <Badge variant="outline" className="w-fit gap-2">
                    <FaCalendarAlt />
                    {formatDate(
                      visit.visit_date || visit.visitDate || visit.created_at,
                    )}
                  </Badge>
                </div>

                {visit.advice && (
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Advice:</span> {visit.advice}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviousVisits;
