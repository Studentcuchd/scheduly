const isRenderRuntime = process.env.RENDER === "true" || Boolean(process.env.RENDER_EXTERNAL_URL);

if (!isRenderRuntime && process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}
import express from "express";
import cors from "cors";
import compression from "compression";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./config/db.js";

import eventTypeRoutes from "./routes/eventType.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import publicBookingRoutes from "./routes/publicBooking.routes.js";

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://scheduly-gtir.vercel.app",
];

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envOrigins])
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS not allowed"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "256kb" }));

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Scheduly API is running",
    routes: [
      "/api/health",
      "/api/event-types",
      "/api/availability",
      "/api/booking",
      "/api/meetings",
      "/api/public/:username/:slug",
      "/api/slots/:username/:slug",
      "/api/book",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/event-types", eventTypeRoutes);
app.use("/api/events", eventTypeRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api", publicBookingRoutes);

app.use(errorHandler);

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  const PORT = process.env.PORT || 5000;

  try {
    await prisma.$connect();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database.", {
      message: error?.message,
      code: error?.code,
    });
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("Scheduly Backend is Running 🚀");
});
export default app;
