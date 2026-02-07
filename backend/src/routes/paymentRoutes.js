import express from "express";
import {
  createStripeCheckoutSession,
  stripeWebhook,
  verifySession
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/stripe/checkout-session", protect, createStripeCheckoutSession);
router.post("/stripe/webhook", stripeWebhook);
router.post("/stripe/verify-session", protect, verifySession);
export default router;