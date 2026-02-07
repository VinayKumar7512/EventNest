import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { PaymentsAPI } from "../services/api.js";

export const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      PaymentsAPI.verifySession({ sessionId })
        .catch(err => console.error("Payment verification failed", err));
    }
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-slate-900">
        Payment successful
      </h1>
      <p className="text-sm text-slate-600">
        Thank you for your booking. Your seat is secured!
      </p>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">
          Your ticket is ready!
        </p>
        <p className="text-xs text-blue-600 mb-3">
          Please download your ticket or view it in "My Bookings".
        </p>
        <Link
          to="/bookings"
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to My Bookings to Download Ticket
        </Link>
      </div>

      {sessionId && (
        <p className="text-xs text-slate-500 mt-2">Transaction ID: {sessionId.slice(-10)}</p>
      )}

      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/events"
          className="text-primary-600 text-sm font-medium hover:text-primary-700"
        >
          Browse more events
        </Link>
      </div>
    </div>
  );
};

export const CheckoutCancel = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">
        Payment cancelled
      </h1>
      <p className="text-sm text-slate-600">
        Your Stripe payment was cancelled. You can try again at any time.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          to="/events"
          className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
        >
          Back to events
        </Link>
      </div>
    </div>
  );
};