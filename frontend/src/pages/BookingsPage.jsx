import React, { useEffect, useState } from "react";
import { BookingsAPI, AuthAPI } from "../services/api.js";
import { generateTicketPDF } from "../utils/pdfGenerator.js";
import { TermsPolicy } from "../components/TermsPolicy.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [demoBookings, setDemoBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    password: ""
  });
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        password: ""
      });
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await BookingsAPI.myBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    const storedDemoBookings = JSON.parse(localStorage.getItem("demoBookings") || "[]");
    setDemoBookings(storedDemoBookings);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    try {
      const payload = {
        name: profileForm.name,
        phone: profileForm.phone
      };
      if (profileForm.password) {
        payload.password = profileForm.password;
      }
      await AuthAPI.updateProfile(payload);
      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setShowProfile(false), 1500);
    } catch (error) {
      console.error("Failed to update profile", error);
      setProfileMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading bookings...</p>;
  }

  const allBookings = [...bookings, ...demoBookings];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-semibold text-slate-900">My bookings</h1>
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setShowProfile(true)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="text-slate-500 hover:text-slate-700 underline"
          >
            Terms & Refund Policy
          </button>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border"
                />
              </div>
              {profileMessage && <p className={`text-xs ${profileMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>{profileMessage}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {allBookings.length === 0 ? (
        <p className="text-sm text-slate-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {demoBookings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>Demo Bookings:</strong> You have {demoBookings.length} demo booking{demoBookings.length > 1 ? "s" : ""} from sample events.
              </p>
            </div>
          )}

          {allBookings.map((b, index) => {
            const isDemo = b.bookingId && b.bookingId.startsWith("DEMO-");
            const eventTitle = b.event?.title || "Unknown Event";
            const eventDate = b.event?.startDate || null;
            const eventVenue = b.event?.venue || "";
            const isPaid = b.paymentStatus === "completed";

            return (
              <div
                key={b._id || b.bookingId || index}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900 text-base">
                      {eventTitle}
                    </p>
                    {isDemo && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full uppercase">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {eventDate && new Date(eventDate).toLocaleString()}{" "}
                    {eventVenue && `· ${eventVenue}`}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {b.bookingId || b._id}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-slate-900 font-semibold">
                      {b.quantity} ticket{b.quantity > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      ₹{typeof b.totalAmount === "number" ? b.totalAmount.toLocaleString('en-IN') : b.totalAmount}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${b.paymentStatus === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : b.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {b.paymentStatus || "completed"}
                      </span>
                    </div>

                    {isPaid && !isDemo && (
                      <button
                        onClick={() => generateTicketPDF(b)}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-md hover:bg-primary-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showTerms && <TermsPolicy onClose={() => setShowTerms(false)} />}
    </div>
  );
};