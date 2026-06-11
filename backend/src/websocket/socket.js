
import { Server } from "socket.io";
import { SOCKET_ROOMS } from "../lib/constants.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Doctor apne room mein join kare
    socket.on("join:doctor", (doctorId) => {
      socket.join(`${SOCKET_ROOMS.DOCTOR_PREFIX}${doctorId}`);
      console.log(`Doctor ${doctorId} joined room`);
    });

    // Receptionist room
    socket.on("join:receptionist", () => {
      socket.join(SOCKET_ROOMS.RECEPTIONIST);
      console.log(`Receptionist joined room`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};