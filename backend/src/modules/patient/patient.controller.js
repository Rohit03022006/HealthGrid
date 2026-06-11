import {
  registerPatientService,
  getPatientsService,
  getPatientByIdService,
  getPatientByPhoneService,
  updatePatientService,
} from "./patient.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const registerPatient = async (req, res) => {
  const { name, age, gender, phone, address } = req.body;

  if (!name || !age || !gender || !phone) {
    return errorResponse(res, 400, "Name, age, gender, phone required");
  }

  try {
    const patient = await registerPatientService({
      name,
      age,
      gender,
      phone,
      address,
    });
    return successResponse(res, 201, "Patient registered", patient);
  } catch (err) {
    if (err.message === "PATIENT_EXISTS") {
      return errorResponse(res, 409, "Patient already exists with this phone");
    }
    throw err;
  }
};

export const getPatients = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";

  const result = await getPatientsService(page, limit, search);
  return successResponse(res, 200, "Patients fetched", result);
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await getPatientByIdService(req.params.id);
    return successResponse(res, 200, "Patient fetched", patient);
  } catch (err) {
    if (err.message === "PATIENT_NOT_FOUND") {
      return errorResponse(res, 404, "Patient not found");
    }
    throw err;
  }
};

export const getPatientByPhone = async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return errorResponse(res, 400, "Phone number required");
  }

  try {
    const patient = await getPatientByPhoneService(phone);
    return successResponse(res, 200, "Patient found", patient);
  } catch (err) {
    if (err.message === "PATIENT_NOT_FOUND") {
      return errorResponse(res, 404, "Patient not found");
    }
    throw err;
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await updatePatientService(
      req.params.id,
      req.body,
      req.user.id,
    );
    return successResponse(res, 200, "Patient updated", patient);
  } catch (err) {
    if (err.message === "PATIENT_NOT_FOUND") {
      return errorResponse(res, 404, "Patient not found");
    }
    throw err;
  }
};

