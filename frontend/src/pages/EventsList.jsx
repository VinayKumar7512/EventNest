import React, { useEffect, useState } from "react";
import { EventsAPI } from "../services/api.js";
import { EventCard } from "../components/EventCard.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";

export const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, loading: locationLoading } = useGeolocation();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    minPrice: "",
    maxPrice: ""
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      let params = { ...filters };
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );
      const { data } = await EventsAPI.list(params)
      if (data.length === 0) {
        setEvents([]);
      } else {
        const sortedEvents = [...data].sort((a, b) => {
          const userCity = location?.city?.toLowerCase();
          if (userCity) {
            const aMatch = a.location.toLowerCase().includes(userCity);
            const bMatch = b.location.toLowerCase().includes(userCity);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
          }
          return new Date(a.startDate) - new Date(b.startDate);
        });
        setEvents(sortedEvents);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!locationLoading) {
      loadEvents();
    }
  }, [locationLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "search" && value.length > 2) {
        setTimeout(() => loadEvents(), 500);
      }
      return newFilters;
    });
  };

  const handleApply = (e) => {
    e.preventDefault();
    loadEvents();
  };

  useEffect(() => {
    if (!locationLoading) {
      loadEvents();
    }
  }, [filters.category]);
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <form
          onSubmit={handleApply}
          className="grid md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Title, venue, location..."
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="concert">Concert</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="festival">Festival</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Location
              {location && location.city && location.city !== "Unknown" && (
                <span className="ml-1 text-primary-600">(Auto-detected)</span>
              )}
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder={location?.city || "City, country"}
              className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="Min (₹)"
                  className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="Max (₹)"
                  className="w-full rounded-md border-slate-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      {loading || locationLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary-600 border-t-transparent" />
          <span className="ml-2 text-sm text-slate-500">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-slate-500 mb-2">No events match your filters.</p>
          <button
            onClick={loadEvents}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};