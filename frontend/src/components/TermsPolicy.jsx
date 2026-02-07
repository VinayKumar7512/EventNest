import React from "react";

export const TermsPolicy = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-slate-900">Terms & Refund Policy</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Ticket Booking & Payment</h3>
                        <p>
                            By booking a ticket on Event Booking, you agree to the terms listed here. All payments are processed securely through Stripe.
                            Tickets are subject to availability and are sold on a first-come, first-served basis.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">2. No Refund Policy</h3>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">
                            <p className="font-medium">⚠️ Important: All sales are final.</p>
                            <p className="mt-1">
                                Once a payment is successfully processed and a ticket is issued, <strong>no refunds, cancellations, or exchanges</strong> will be permitted under any circumstances, except where required by law or if the event is cancelled by the organizer.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Event Cancellation</h3>
                        <p>
                            In the rare occasion that an event is cancelled by the organizer, a full refund will be automatically issued to the original payment method within 5-7 business days.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Entry Rules</h3>
                        <p>
                            You must present your valid ticket (digital or printed) at the venue entry. The "Check-in ID" on your ticket is required for validation. Late entry may be refused depending on the venue rules.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">5. Conduct</h3>
                        <p>
                            Event Booking reserves the right to refuse entry or remove anyone from the event who behaves in a disorderly, disruptive, or inappropriate manner, without refund.
                        </p>
                    </section>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};