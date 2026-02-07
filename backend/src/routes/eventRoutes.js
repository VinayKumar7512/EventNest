import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventActive
} from "../controllers/eventController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", protect, requireRole("admin"), createEvent);
router.put("/:id", protect, requireRole("admin"), updateEvent);
router.delete("/:id", protect, requireRole("admin"), deleteEvent);
router.patch("/:id/toggle", protect, requireRole("admin"), toggleEventActive);
export default router;