import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { EventsList } from "./pages/EventsList.jsx";
import { EventDetails } from "./pages/EventDetails.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import { BookingsPage } from "./pages/BookingsPage.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import {
  CheckoutCancel,
  CheckoutSuccess
} from "./pages/CheckoutResult.jsx";

import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsList />} />

        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />

        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </Layout>
  );
};
export default App;