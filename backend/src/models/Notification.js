import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        },
        type: {
            type: String,
            enum: ["event_reminder", "booking_confirmation", "event_update"],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;