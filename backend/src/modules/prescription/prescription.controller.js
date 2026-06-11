import {
  createPrescriptionService,
  getPrescriptionByVisitService,
  getPrescriptionsByPatientService,
} from "./prescription.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const createPrescription = async (req, res) => {
  const {
    tokenId,
    chiefComplaint,
    diagnosis,
    medicines,
    advice,
    followupDate,
  } = req.body;

  // Basic validation
  if (!tokenId || !chiefComplaint || !diagnosis) {
    return errorResponse(res, 400, "Token, complaint and diagnosis required");
  }

  if (!medicines || medicines.length === 0) {
    return errorResponse(res, 400, "At least one medicine required");
  }

  // Medicine format validate 
  for (const med of medicines) {
    if (!med.name || !med.dosage || !med.frequency || !med.duration) {
      return errorResponse(
        res,
        400,
        "Each medicine needs name, dosage, frequency, duration",
      );
    }
  }

  try {
    const result = await createPrescriptionService(req.body, req.user.id);
    return successResponse(res, 201, "Prescription created", result);
  } catch (err) {
    if (err.message === "TOKEN_NOT_FOUND")
      return errorResponse(res, 404, "Token not found");
    if (err.message === "TOKEN_NOT_ACTIVE")
      return errorResponse(
        res,
        400,
        "Token is not active — call patient first",
      );
    if (err.message === "MEDICINES_REQUIRED")
      return errorResponse(res, 400, "Medicines required");
    throw err;
  }
};

export const getPrescriptionByVisit = async (req, res) => {
  try {
    const rx = await getPrescriptionByVisitService(req.params.visitId);
    return successResponse(res, 200, "Prescription fetched", rx);
  } catch (err) {
    if (err.message === "PRESCRIPTION_NOT_FOUND")
      return errorResponse(res, 404, "Prescription not found");
    throw err;
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  const rxList = await getPrescriptionsByPatientService(req.params.patientId);
  return successResponse(res, 200, "Prescriptions fetched", rxList);
};
