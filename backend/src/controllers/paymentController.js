import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/email.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20"
});
export const createStripeCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.paymentStatus === "completed") {
      return res.status(400).json({ message: "Booking already paid" });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: booking.event.title,
              description: booking.event.description
            },
            unit_amount: Math.round(booking.event.price * 100)
          },
          quantity: booking.quantity
        }
      ],
      mode: "payment",
      customer_email: req.user.email,
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      metadata: {
        bookingId: booking._id.toString()
      }
    });
    await Payment.create({
      booking: booking._id,
      provider: "stripe",
      amount: booking.totalAmount,
      status: "pending"
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ message: "Stripe error" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      const booking = await Booking.findById(bookingId).populate("event user");
      if (!booking) {
        console.error("Booking not found for webhook");
      } else {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
        booking.paymentIntentId = session.payment_intent;
        await booking.save();

        const eventDoc = await Event.findById(booking.event._id);
        if (eventDoc) {
          eventDoc.bookedSeats += booking.quantity;
          await eventDoc.save();
        }

        await Payment.findOneAndUpdate(
          { booking: booking._id },
          { status: "completed", rawResponse: session },
          { new: true }
        );

        await Notification.create({
          user: booking.user._id,
          booking: booking._id,
          type: "booking_confirmation",
          message: `Your booking for ${booking.event.title} is confirmed! ${booking.quantity} ticket(s) booked.`
        });

        try {
          const { generateTicketEmailHTML } = await import("../utils/emailTemplates.js");
          const emailHTML = generateTicketEmailHTML(booking);

          await sendEmail({
            to: booking.user.email,
            subject: `Booking Confirmed: ${booking.event.title}`,
            html: emailHTML
          });

        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError.message);
        }
      }
    }
  } catch (error) {
    console.error("Stripe webhook handling error:", error.message);
  }

  res.json({ received: true });
};

export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const bookingId = session.metadata.bookingId;
      const booking = await Booking.findById(bookingId).populate("event");

      if (booking && booking.paymentStatus !== "completed") {
        booking.paymentStatus = "completed";
        booking.status = "confirmed";
        booking.paymentIntentId = session.payment_intent;
        await booking.save();

        const eventDoc = await Event.findById(booking.event._id);
        if (eventDoc) {
          eventDoc.bookedSeats += booking.quantity;
          await eventDoc.save();
        }

        await Payment.findOneAndUpdate(
          { booking: booking._id },
          { status: "completed", rawResponse: session },
          { new: true, upsert: true }
        );

        const bookingWithUser = await Booking.findById(bookingId).populate("event user");
        if (bookingWithUser && bookingWithUser.user) {
          await Notification.create({
            user: bookingWithUser.user._id,
            booking: bookingWithUser._id,
            type: "booking_confirmation",
            message: `Your booking for ${bookingWithUser.event.title} is confirmed! ${bookingWithUser.quantity} ticket(s) booked.`
          });

          try {
            const { generateTicketEmailHTML } = await import("../utils/emailTemplates.js");
            const emailHTML = generateTicketEmailHTML(bookingWithUser);

            await sendEmail({
              to: bookingWithUser.user.email,
              subject: `Booking Confirmed: ${bookingWithUser.event.title}`,
              html: emailHTML
            });

          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError.message);
          }
        }
      }
      return res.json({ status: "completed" });
    }
    res.json({ status: "pending" });
  } catch (error) {
    console.error("Verify session error:", error.message);
    res.status(500).json({ message: "Verification failed" });
  }
};