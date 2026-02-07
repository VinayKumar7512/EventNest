import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      default: "stripe"
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "inr"
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    rawResponse: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;