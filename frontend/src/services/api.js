import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  refreshToken: (token) => api.post("/auth/refresh-token", { token })
};

export const EventsAPI = {
  list: (params) => api.get("/events", { params }),
  get: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  remove: (id) => api.delete(`/events/${id}`),
  toggleActive: (id) => api.patch(`/events/${id}/toggle`)
};

export const BookingsAPI = {
  create: (data) => api.post("/bookings", data),
  myBookings: () => api.get("/bookings/me"),
  all: () => api.get("/bookings"),
  getEventAttendees: (eventId) => api.get(`/bookings/event/${eventId}/attendees`)
};

export const PaymentsAPI = {
  createSession: (data) => api.post("/payments/stripe/checkout-session", data),
  verifySession: (data) => api.post("/payments/stripe/verify-session", data)
};

export const NotificationsAPI = {
  getNotifications: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all")
};