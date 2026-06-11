import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { validateEnv } from "./src/config/env.js";
import { createServer } from "http";
import { initSocket } from "./src/websocket/socket.js";
import corsOptions from "./src/config/corsOptions.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

// Routes
import authRoutes from "./src/modules/auth/auth.routes.js";
import patientRoutes from "./src/modules/patient/patient.routes.js";
import queueRoutes from "./src/modules/queue/queue.routes.js";
import tokenRoutes from "./src/modules/token/token.routes.js";
import prescriptionRoutes from "./src/modules/prescription/prescription.routes.js";
import medicineRoutes from "./src/modules/medicine/medicine.routes.js";
import templateRoutes from "./src/modules/template/template.routes.js";
import analyticsRoutes from "./src/modules/analytics/analytics.routes.js";
validateEnv(); 

const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket
initSocket(httpServer);

app.get("/test", (req, res) => {
  res.send("Working");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/queue", queueRoutes)
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`HealthGrid backend running on port ${PORT}`);
});
