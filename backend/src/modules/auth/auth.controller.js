import { loginService, getMeService, registerService } from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await registerService({
      name,
      email,
      password,
      role,
    });

    return successResponse(res, 201, "User registered", user);
  } catch (err) {
    if (err.message === "EMAIL_EXISTS") {
      return errorResponse(res, 409, "Email already exists");
    }

    throw err;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return errorResponse(res, 400, "Email and password required");
  }

  try {
    const data = await loginService(email, password);
    return successResponse(res, 200, "Login successful", data);
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return errorResponse(res, 401, "Invalid email or password");
    }

    throw err;
  }
};

export const getMe = async (req, res) => {
  const user = await getMeService(req.user.id);
  return successResponse(res, 200, "User fetched", user);
};
