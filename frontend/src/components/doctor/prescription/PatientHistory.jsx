// src/components/doctor/prescription/PatientHistory.jsx

import {
  FaHashtag,
  FaPhoneAlt,
  FaUser,
  FaUserMd,
  FaVenusMars,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PatientHistory = ({ patient }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaUser className="text-primary" />
          Patient History
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Patient Name</p>
            <p className="font-semibold">{patient.name || "N/A"}</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FaVenusMars />
              Age / Gender
            </p>
            <p className="font-semibold">
              {patient.age || "N/A"} / {patient.gender || "N/A"}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FaHashtag />
              Patient Code
            </p>
            <p className="font-semibold">{patient.code || "N/A"}</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FaPhoneAlt />
              Phone
            </p>
            <p className="font-semibold">{patient.phone || "N/A"}</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Token</p>
            <Badge variant="secondary">{patient.tokenDisplay || "N/A"}</Badge>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <FaUserMd />
              Doctor
            </p>
            <p className="font-semibold">{patient.doctorName || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHistory;
