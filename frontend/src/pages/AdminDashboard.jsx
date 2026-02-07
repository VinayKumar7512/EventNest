import React, { useEffect, useState } from "react";
import { BookingsAPI, EventsAPI } from "../services/api.js";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsRes, bookingsRes] = await Promise.all([
          EventsAPI.list(),
          BookingsAPI.all()
        ]);
        const events = eventsRes.data;
        const bookings = bookingsRes.data;
        const revenue = bookings
          .filter((b) => b.paymentStatus === "completed")
          .reduce((sum, b) => sum + b.totalAmount, 0);
        setStats({
          totalEvents: events.length,
          totalBookings: bookings.length,
          revenue
        });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Admin dashboard</h1>
      {loading ? (
        <p className="text-sm text-slate-500">Loading stats...</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Events
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.totalEvents}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Bookings
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.totalBookings}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Revenue
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              ₹{stats.revenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}
      <AdminEvents />
    </div>
  );
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "concert",
    venue: "",
    location: "",
    startDate: "",
    endDate: "",
    price: "",
    totalSeats: "",
    imageUrl: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await EventsAPI.list();
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats)
      };

      if (editingId) {
        await EventsAPI.update(editingId, payload);
      } else {
        await EventsAPI.create(payload);
      }

      setForm({
        title: "",
        description: "",
        category: "concert",
        venue: "",
        location: "",
        startDate: "",
        endDate: "",
        price: "",
        totalSeats: "",
        imageUrl: ""
      });
      setEditingId(null);
      await loadEvents();
    } catch (err) {
      console.error("Failed to save event", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      location: event.location,
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      price: event.price,
      totalSeats: event.totalSeats,
      imageUrl: event.imageUrl || ""
    });
    setEditingId(event._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({
      title: "",
      description: "",
      category: "concert",
      venue: "",
      location: "",
      startDate: "",
      endDate: "",
      price: "",
      totalSeats: "",
      imageUrl: ""
    });
    setEditingId(null);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await EventsAPI.remove(id);
      await loadEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const handleViewAttendees = async (eventId) => {
    setLoadingAttendees(true);
    setShowAttendees(true);
    setSearchTerm("");
    try {
      const { data } = await BookingsAPI.getEventAttendees(eventId);
      setAttendeeData(data);
    } catch (err) {
      console.error("Failed to load attendees", err);
      alert("Failed to load attendees");
      setShowAttendees(false);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredAttendees = attendeeData?.attendees?.filter(attendee =>
    attendee.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.checkInId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            {editingId ? "Edit event" : "Create event"}
          </h2>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="concert">Concert</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="festival">Festival</option>
            <option value="other">Other</option>
          </select>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue"
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              name="totalSeats"
              value={form.totalSeats}
              onChange={handleChange}
              placeholder="Seats"
              required
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 px-4 py-2.5 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : (editingId ? "Update Event" : "Create Event")}
          </button>
        </form>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Manage events
        </h2>
        {loading ? (
          <p className="text-xs text-slate-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-xs text-slate-500">No events yet.</p>
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <div
                key={e._id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm mb-1">{e.title}</p>
                  <p className="text-xs text-slate-500 mb-1">
                    {new Date(e.startDate).toLocaleString()} · {e.venue}
                  </p>
                  <p className="text-xs text-slate-500">
                    {e.bookedSeats}/{e.totalSeats} booked · {e.price === 0 ? "Free" : `₹${e.price}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <button
                    onClick={() => handleViewAttendees(e._id)}
                    className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                  >
                    View Attendees
                  </button>
                  <button
                    onClick={() => handleEdit(e)}
                    className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAttendees && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Event Attendees
                </h2>
                <button
                  onClick={() => setShowAttendees(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {attendeeData && (
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-900">{attendeeData.event.title}</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(attendeeData.event.startDate).toLocaleString()} · {attendeeData.event.venue}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-slate-600">
                      <strong>{attendeeData.totalBookings}</strong> Bookings
                    </span>
                    <span className="text-slate-600">
                      <strong>{attendeeData.totalAttendees}</strong> Total Tickets
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, or check-in ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mt-3 px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loadingAttendees ? (
                <p className="text-center text-slate-500">Loading attendees...</p>
              ) : filteredAttendees.length === 0 ? (
                <p className="text-center text-slate-500">
                  {searchTerm ? "No attendees match your search" : "No confirmed bookings yet"}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredAttendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-primary-300 transition-colors"
                    >
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
                          <p className="font-medium text-slate-900">{attendee.userName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                          <p className="text-sm text-slate-700">{attendee.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Check-In ID</p>
                          <p className="text-lg font-bold text-primary-600">{attendee.checkInId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Booking Details</p>
                          <p className="text-sm text-slate-700">
                            {attendee.quantity} ticket(s) · ₹{attendee.totalAmount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Booked: {new Date(attendee.bookedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowAttendees(false)}
                className="w-full px-4 py-2 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};