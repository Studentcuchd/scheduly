import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";

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

const allowWildcardFallback = envOrigins.includes("*");
const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envOrigins.filter((origin) => origin !== "*")])
);

const corsOptions = allowWildcardFallback
  ? { origin: process.env.CORS_ORIGIN || "*" }
  : {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.send("Scheduly Backend is Running 🚀");
});
export default app;
