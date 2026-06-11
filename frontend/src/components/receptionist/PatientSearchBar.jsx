
import { useState } from "react";
import {
  FaExclamationTriangle,
  FaPhoneAlt,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

import { getPatientByPhoneAPI } from "@/services/patientService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";

const PatientSearchBar = ({ onPatientFound, onNotFound }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const cleanPhone = phone.trim();

    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Valid phone number required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await getPatientByPhoneAPI(cleanPhone);
      onPatientFound(res.data);
    } catch (err) {
      if (err?.message === "Patient not found") {
        onNotFound();
      } else {
        setError(err?.message || "Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Card className="border-primary/20 shadow-none">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <FaPhoneAlt className="text-primary" />
            Search Patient by Phone
          </Label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="Enter 10 digit phone number"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyDown}
                maxLength={10}
                disabled={loading}
                className="h-11 bg-background pl-10 text-base"
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-11 w-full sm:w-auto sm:min-w-32"
            >
              <FaSearch className="mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Badge
          variant="secondary"
          className="flex w-fit items-center gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-xs font-normal text-muted-foreground"
        >
          <FaUserPlus className="shrink-0 text-primary" />
          <span>If patient is not found, registration form will appear.</span>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default PatientSearchBar;
