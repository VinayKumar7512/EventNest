import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["concert", "conference", "workshop", "festival", "other"],
      default: "other"
    },
    venue: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
eventSchema.virtual("availableSeats").get(function () {
  return this.totalSeats - this.bookedSeats;
});
const Event = mongoose.model("Event", eventSchema);
export default Event;