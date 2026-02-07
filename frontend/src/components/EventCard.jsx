import React, { useState } from "react";
import { Link } from "react-router-dom";
export const EventCard = ({ event }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  const getCategoryColor = (category) => {
    const colors = {
      concert: "bg-gradient-to-br from-purple-500 to-purple-600",
      conference: "bg-gradient-to-br from-blue-500 to-blue-600",
      workshop: "bg-gradient-to-br from-green-500 to-green-600",
      festival: "bg-gradient-to-br from-orange-500 to-orange-600",
      other: "bg-gradient-to-br from-slate-500 to-slate-600"
    };
    return colors[category] || colors.other;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <Link
      to={`/events/${event._id}`}
      className="group bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden flex flex-col hover:shadow-card-hover transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="animate-spin h-8 w-8 rounded-full border-3 border-primary-500 border-t-transparent" />
          </div>
        )}
        {event.imageUrl && !imageError ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`h-48 w-full object-cover ${imageLoading ? "opacity-0" : "opacity-100"} transition-all duration-300 group-hover:scale-105`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className={`h-48 w-full ${getCategoryColor(event.category)} flex items-center justify-center`}>
            <div className="text-center text-white px-4">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-semibold uppercase tracking-wide">{event.category}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full">
            {event.category}
          </span>
          <span className="text-xl font-bold text-slate-900">
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">
              {event.totalSeats - event.bookedSeats} seats left
            </span>
          </div>
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold group-hover:bg-primary-700 transition-colors whitespace-nowrap shadow-sm">
            View Details
            <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};