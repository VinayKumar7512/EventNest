import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventsAPI, BookingsAPI, PaymentsAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getCategoryColor = (category) => {
    return colors[category] || colors.other;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await EventsAPI.get(id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!event) return;
    setError("");
    setBookingLoading(true);
    try {
      const { data: booking } = await BookingsAPI.create({
        eventId: event._id,
        quantity
      });
      console.log("Booking created with ID:", booking._id);
      if (!booking._id) {
        throw new Error("Invalid booking ID returned from server");
      }
      const { data: session } = await PaymentsAPI.createSession({
        bookingId: booking._id
      });
      window.location.href = session.url;
    } catch (err) {
      console.error("Booking failed", err);
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-sm text-slate-500">Event not found.</p>;
  }

  const availableSeats = event.totalSeats - event.bookedSeats;

  const formatPrice = (price) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="relative w-full h-64 bg-slate-200 rounded-xl shadow-sm overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          )}
          {event.imageUrl && !imageError ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className={`w-full h-64 object-cover ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className={`w-full h-64 ${getCategoryColor(event.category)} flex items-center justify-center`}>
              <div className="text-center text-white px-4">
                <svg
                  className="w-16 h-16 mx-auto mb-2 opacity-75"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium uppercase">{event.category}</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-2">
            {event.category}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {event.title}
          </h1>
          <p className="text-slate-600 whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Date & time
            </p>
            <p className="text-sm text-slate-800">
              {formatDate(event.startDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Venue
            </p>
            <p className="text-sm text-slate-800">{event.venue}</p>
            <p className="text-xs text-slate-500">{event.location}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Price
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formatPrice(event.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Available
              </p>
              <p className="text-sm text-slate-800">{availableSeats} seats</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-slate-500 uppercase tracking-wide font-medium">
              Number of Tickets
            </label>
            <input
              type="number"
              min={1}
              max={availableSeats}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    availableSeats,
                    Math.max(1, Number(e.target.value) || 1)
                  )
                )
              }
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Total Amount:</span>
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(event.price * quantity)}
              </span>
            </div>
          </div>
          <button
            onClick={handleBook}
            disabled={availableSeats === 0 || bookingLoading}
            className="w-full mt-4 px-4 py-3 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {availableSeats === 0
              ? "Sold out"
              : bookingLoading
                ? "Redirecting to payment..."
                : "Book with Stripe"}
          </button>
          {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </aside>
    </div>
  );
};