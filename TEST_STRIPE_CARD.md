# Stripe Test Card Numbers

## For Testing Payment Gateway

Use these test card numbers in Stripe Checkout to test the payment flow:

### ✅ Successful Payment
- **Card Number:** `4242 4242 4242 4242`
- **Expiry Date:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5 digits (e.g., `560001`)

### ❌ Payment Declined
- **Card Number:** `4000 0000 0000 0002`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP Code:** Any 5 digits

### 🔐 Requires Authentication (3D Secure)
- **Card Number:** `4000 0027 6000 3184`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP Code:** Any 5 digits

---

## What Happens After Payment

1. **Payment Processing:** Stripe processes the payment
2. **Webhook Triggered:** Backend receives payment confirmation
3. **Booking Confirmed:** Booking status changes to "confirmed"
4. **Seats Updated:** Event available seats are reduced
5. **Email Sent:** Confirmation email sent with:
   - Booking details
   - Check-in ID (format: `CHK-XXXXXXXX`)
   - Event information
   - Payment confirmation

---

## Check Your Email

After successful payment, check the email address you used to register/login. You should receive:

- ✅ Booking confirmation
- ✅ Check-in ID for venue entry
- ✅ Event details (date, time, venue)
- ✅ Number of tickets
- ✅ Total amount paid

---

## Note

- All payments are processed in **INR (Indian Rupees)**
- Currency is automatically set to `inr` in Stripe checkout
- Prices displayed are in ₹ (Rupees)
- Test mode only - no real money is charged
