import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
export const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const availableSeats = event.totalSeats - event.bookedSeats;
    if (quantity > availableSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }
    const totalAmount = quantity * event.price;
    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      quantity,
      totalAmount
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { date, status, eventName } = req.query;
    let query = {};

    if (status) {
      query.paymentStatus = status;
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    if (eventName) {
      const matchingEvents = await Event.find({
        title: { $regex: eventName, $options: 'i' }
      }).select('_id');
      if (matchingEvents.length > 0) {
        query.event = { $in: matchingEvents.map(e => e._id) };
      } else {
        return res.json([]);
      }
    }
    const bookings = await Booking.find(query)
      .populate("event")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const bookings = await Booking.find({
      event: eventId,
      status: "confirmed",
      paymentStatus: "completed"
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const attendees = bookings.map(booking => ({
      bookingId: booking.bookingId,
      checkInId: `CHK-${booking.bookingId.substring(0, 8).toUpperCase()}`,
      userName: booking.user?.name || "Unknown",
      userEmail: booking.user?.email || "N/A",
      quantity: booking.quantity,
      totalAmount: booking.totalAmount,
      bookedAt: booking.createdAt
    }));
    res.json({
      event: {
        id: event._id,
        title: event.title,
        startDate: event.startDate,
        venue: event.venue
      },
      totalAttendees: attendees.reduce((sum, a) => sum + a.quantity, 0),
      totalBookings: attendees.length,
      attendees
    });
  } catch (error) {
    console.error("Get event attendees error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};