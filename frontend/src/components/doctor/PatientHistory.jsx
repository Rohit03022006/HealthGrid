
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFileMedicalAlt,
  FaIdCard,
  FaNotesMedical,
  FaPhoneAlt,
  FaUserInjured,
  FaVenusMars,
} from "react-icons/fa";

import { getPatientByIdAPI } from "@/services/patientService";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PatientHistory = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getPatientByIdAPI(patientId);
        setPatient(res.data);
      } catch {
        setError("Failed to load patient history");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex min-h-40 items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Loading patient info...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/10 shadow-none">
        <CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
          <FaExclamationTriangle />
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!patient) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaUserInjured className="text-primary" />
          Patient History
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBox
            icon={<FaUserInjured />}
            label="Name"
            value={patient.name || "N/A"}
          />
          <InfoBox
            icon={<FaIdCard />}
            label="Code"
            value={patient.patient_code || "N/A"}
          />
          <InfoBox
            icon={<FaCalendarAlt />}
            label="Age"
            value={patient.age ? `${patient.age} yrs` : "N/A"}
          />
          <InfoBox
            icon={<FaVenusMars />}
            label="Gender"
            value={patient.gender || "N/A"}
          />
          <InfoBox
            icon={<FaPhoneAlt />}
            label="Phone"
            value={patient.phone || "N/A"}
          />
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <FaFileMedicalAlt className="text-primary" />
            Previous Visits
            <Badge variant="secondary">
              {patient.visitHistory?.length || 0}
            </Badge>
          </h3>

          {patient.visitHistory?.length === 0 ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="p-5 text-center text-sm text-muted-foreground">
                No previous visits
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3  pr-2">
              {patient.visitHistory?.map((visit) => (
                <Card key={visit.visit_id} className="shadow-none">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">
                          {new Date(visit.visit_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr. {visit.doctor_name || "N/A"}
                        </p>
                      </div>

                      {visit.followup_date && (
                        <Badge variant="outline" className="w-fit">
                          Follow-up:{" "}
                          {new Date(visit.followup_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    <div className="grid gap-2 text-sm">
                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">
                          Complaint:
                        </span>{" "}
                        {visit.chief_complaint || "N/A"}
                      </p>

                      <p className="line-clamp-2">
                        <span className="text-muted-foreground">
                          Diagnosis:
                        </span>{" "}
                        {visit.diagnosis || "N/A"}
                      </p>

                      {visit.advice && (
                        <p className="line-clamp-2">
                          <span className="text-muted-foreground">Advice:</span>{" "}
                          {visit.advice}
                        </p>
                      )}
                    </div>

                    {visit.medicines?.length > 0 && (
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                          <FaNotesMedical className="text-primary" />
                          Medicines
                        </p>

                        <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                          {visit.medicines.map((med, i) => (
                            <div
                              key={i}
                              className="flex flex-col gap-1 rounded-lg bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span className="font-medium line-clamp-1">
                                {med.name}
                              </span>
                              <span className="text-muted-foreground">
                                {med.frequency} · {med.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const InfoBox = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  );
};

export default PatientHistory;
