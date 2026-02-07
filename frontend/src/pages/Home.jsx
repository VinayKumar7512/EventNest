import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EventsAPI } from "../services/api.js";
import { EventCard } from "../components/EventCard.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useAuth } from "../context/AuthContext.jsx";

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, loading: locationLoading } = useGeolocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let params = {};

        if (location && location.city && location.city !== "Unknown") {
          params.location = location.city;
        }

        const { data } = await EventsAPI.list(params);

        if (data.length === 0 && location && location.city && location.city !== "Unknown") {
          setEvents([]);
        } else {
          setEvents(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    };

    if (!locationLoading) {
      fetchEvents();
    }
  }, [location, locationLoading]);

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          Discover and book{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">amazing events</span> near you.
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Concerts, conferences, workshops, and more. Secure your seat with a
          fast, modern booking experience powered by Stripe.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/events"
            className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Browse Events
          </Link>
          {user ? (
            <Link
              to="/bookings"
              className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              My Bookings
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {location?.city
                ? `Popular events near ${location.city}`
                : "Upcoming events"}
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 group"
          >
            View all
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loading || locationLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary-600 border-t-transparent" />
            <span className="ml-2 text-sm text-slate-500">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">
            No events available yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};