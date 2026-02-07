import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getEventAttendees
} from "../controllers/bookingController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, createBooking);
router.get("/me", protect, getUserBookings);
router.get("/", protect, requireRole("admin"), getAllBookings);
router.get("/event/:eventId/attendees", protect, getEventAttendees);
export default router;