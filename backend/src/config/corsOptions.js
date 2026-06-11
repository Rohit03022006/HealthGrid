const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173"|| "http://localhost:4173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;