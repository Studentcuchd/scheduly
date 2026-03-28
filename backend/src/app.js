import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import { errorHandler } from "./middleware/errorHandler.js";

import eventTypeRoutes from "./routes/eventType.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import publicBookingRoutes from "./routes/publicBooking.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: "256kb" }));

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

export default app;
