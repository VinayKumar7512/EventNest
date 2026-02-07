import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
import cron from "node-cron";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import Booking from "./models/Booking.js";
import Event from "./models/Event.js";
import Notification from "./models/Notification.js";
import { sendEmail } from "./utils/email.js";
import User from "./models/User.js";
const app = express();
app.use(
  "/api/payments/stripe/webhook",
  bodyParser.raw({ type: "application/json" })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const bookings = await Booking.find({
        status: "confirmed",
        reminderSent: false
      }).populate("event user");
      for (const booking of bookings) {
        const event = booking.event;
        if (!event) continue;
        if (
          event.startDate > now &&
          event.startDate <= in24h &&
          booking.user &&
          booking.user.email
        ) {
          await Notification.create({
            user: booking.user._id,
            booking: booking._id,
            type: "event_reminder",
            message: `Reminder: ${event.title} is starting tomorrow at ${event.venue}`
          });

          const html = `
            <p>Hi ${booking.user.name},</p>
            <p>This is a reminder for your upcoming event <strong>${event.title}</strong>.</p>
            <p><strong>Date:</strong> ${event.startDate.toLocaleString()}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p>Thank you for using EventNest.</p>
          `;

          await sendEmail({
            to: booking.user.email,
            subject: `Reminder: ${event.title} is coming up`,
            html
          });

          booking.reminderSent = true;
          await booking.save();
        }
      }
    } catch (error) {
      console.error("Cron reminder error:", error.message);
    }
  });
};
startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});