import {
  getMyTemplatesService,
  createTemplateService,
  updateTemplateService,
  deleteTemplateService,
} from "./template.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getMyTemplates = async (req, res) => {
  const templates = await getMyTemplatesService(req.user.id);
  return successResponse(res, 200, "Templates fetched", templates);
};

export const createTemplate = async (req, res) => {
  const { name, medicines, advice } = req.body;

  if (!name || !medicines || medicines.length === 0) {
    return errorResponse(res, 400, "Name and medicines required");
  }

  try {
    const template = await createTemplateService(req.user.id, req.body);
    return successResponse(res, 201, "Template created", template);
  } catch (err) {
    if (err.code === "23505") { // Unique violation
      return errorResponse(res, 409, "Template name already exists");
    }
    throw err;
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await updateTemplateService(
      req.params.id,
      req.user.id,
      req.body
    );
    return successResponse(res, 200, "Template updated", template);
  } catch (err) {
    if (err.message === "TEMPLATE_NOT_FOUND")
      return errorResponse(res, 404, "Template not found");
    throw err;
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    await deleteTemplateService(req.params.id, req.user.id);
    return successResponse(res, 200, "Template deleted", null);
  } catch (err) {
    if (err.message === "TEMPLATE_NOT_FOUND")
      return errorResponse(res, 404, "Template not found");
    throw err;
  }
};