import { z } from "zod";
import { errorResponse } from "../utils/apiResponse.js";

// Schemas
export const schemas = {

  //  Auth 
  login: z.object({
    email:    z.string().email("Valid email required"),
    password: z.string().min(6, "Password min 6 characters"),
  }),

  //  Patient 
  registerPatient: z.object({
    name:    z.string().min(2, "Name min 2 characters"),
    age:     z.number().int().min(1).max(120),
    gender:  z.enum(["MALE", "FEMALE", "OTHER"]),
    phone:   z.string().regex(/^[6-9]\d{9}$/, "Valid Indian phone required"),
    address: z.string().optional(),
  }),

  updatePatient: z.object({
    name:    z.string().min(2).optional(),
    age:     z.number().int().min(1).max(120).optional(),
    gender:  z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    phone:   z.string().regex(/^[6-9]\d{9}$/).optional(),
    address: z.string().optional(),
  }),

  //  Token 
  assignToken: z.object({
    patientId:   z.string().uuid("Valid patient ID required"),
    reason:      z.string().min(2).max(255).optional(),
    doctorId:    z.string().uuid().optional(),
    offlineUuid: z.string().uuid().optional(),
  }),

  updateTokenStatus: z.object({
    status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  }),

  // Prescription 
  createPrescription: z.object({
    tokenId:        z.string().uuid("Valid token ID required"),
    chiefComplaint: z.string().min(2, "Chief complaint required"),
    diagnosis:      z.string().min(2, "Diagnosis required"),
    medicines: z.array(
      z.object({
        name:         z.string().min(2, "Medicine name required"),
        dosage:       z.string().min(1, "Dosage required"),
        frequency:    z.enum(["1-0-0","0-0-1","1-0-1","1-1-1","SOS","TDS","BD"]),
        duration:     z.string().min(1, "Duration required"),
        instructions: z.string().optional(),
      })
    ).min(1, "At least one medicine required"),
    advice:       z.string().optional(),
    followupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),

  //  Template 
  createTemplate: z.object({
    name: z.string().min(2, "Template name required").max(100),
    medicines: z.array(
      z.object({
        name:         z.string().min(2),
        dosage:       z.string().min(1),
        frequency:    z.enum(["1-0-0","0-0-1","1-0-1","1-1-1","SOS","TDS","BD"]),
        duration:     z.string().min(1),
        instructions: z.string().optional(),
      })
    ).min(1, "At least one medicine required"),
    advice: z.string().optional(),
  }),

  updateTemplate: z.object({
    name: z.string().min(2).max(100).optional(),
    medicines: z.array(
      z.object({
        name:         z.string().min(2),
        dosage:       z.string().min(1),
        frequency:    z.enum(["1-0-0","0-0-1","1-0-1","1-1-1","SOS","TDS","BD"]),
        duration:     z.string().min(1),
        instructions: z.string().optional(),
      })
    ).optional(),
    advice: z.string().optional(),
  }),
};

// Middleware Factory 
export const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      console.error(`Schema "${schemaName}" not found`);
      return errorResponse(res, 500, "Validation schema missing");
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field:   e.path.join("."),
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Parsed + cleaned data replace karo
    req.body = result.data;
    next();
  };
};