import { useState } from "react";
import {
  FaAddressCard,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaSave,
  FaTimes,
  FaUser,
  FaVenusMars,
  FaWifi,
} from "react-icons/fa";

import { registerPatientAPI } from "@/services/patientService";
import { useOfflineSync } from "@/hooks/useOfflineSync";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INITIAL_FORM = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
};

const PatientRegForm = ({ onRegistered, onCancel, prefillPhone = "" }) => {
  const [form, setForm] = useState({ ...INITIAL_FORM, phone: prefillPhone });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { isOnline, saveOffline } = useOfflineSync();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nextValue =
      name === "phone" ? value.replace(/\D/g, "") : value;

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name required";

    if (!form.age || form.age < 1 || form.age > 120) {
      newErrors.age = "Valid age required (1-120)";
    }

    if (!form.gender) newErrors.gender = "Gender required";

    if (!form.phone.match(/^[6-9]\d{9}$/)) {
      newErrors.phone = "Valid Indian phone required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      age: parseInt(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
    };

    try {
      if (isOnline) {
        const res = await registerPatientAPI(payload);
        onRegistered(res.data);
      } else {
        const offlinePatient = {
          ...payload,
          id: crypto.randomUUID(),
          patient_code: "PENDING",
          created_at: new Date().toISOString(),
        };

        await saveOffline("PATIENT", payload);
        onRegistered(offlinePatient);
      }
    } catch (err) {
      if (err?.message?.includes("already exists")) {
        setErrors({ phone: "Patient already registered with this phone" });
      } else {
        setErrors({ submit: err?.message || "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FaUser className="text-primary" />
          </span>
          Register New Patient
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 bg-background pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                min={1}
                max={120}
                disabled={loading}
                className="h-11 bg-background"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm text-foreground outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={loading}
                  className="h-11 bg-background pl-10"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <FaAddressCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address"
                name="address"
                placeholder="Address optional"
                value={form.address}
                onChange={handleChange}
                disabled={loading}
                className="h-11 bg-background pl-10"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <p>{errors.submit}</p>
            </div>
          )}

          {!isOnline && (
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-xs font-normal text-muted-foreground"
            >
              <FaWifi className="shrink-0 text-primary" />
              <span>Offline  - will sync when internet returns</span>
            </Badge>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <FaTimes className="mr-2" />
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              <FaSave className="mr-2" />
              {loading ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientRegForm;