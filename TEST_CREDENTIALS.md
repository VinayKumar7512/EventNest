# Test Credentials & Demo Guide

## Demo Account Credentials

You can use these test credentials to log in and test the booking system:

### Test User Account
- **Email:** `demo@test.com`
- **Password:** `demo123`

### Test Admin Account
- **Email:** `admin@test.com`
- **Password:** `admin123`

> **Note:** These accounts need to be created first through the registration page, or you can create your own test accounts.

---

## Stripe Test Credentials

For testing payment processing with Stripe, use these test card numbers:

### Successful Payment
- **Card Number:** `4242 4242 4242 4242`
- **Expiry Date:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5 digits (e.g., `12345`)

### Payment Declined
- **Card Number:** `4000 0000 0000 0002`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP Code:** Any 5 digits

### Requires Authentication (3D Secure)
- **Card Number:** `4000 0027 6000 3184`
- **Expiry Date:** Any future date
- **CVC:** Any 3 digits
- **ZIP Code:** Any 5 digits

---

## Demo Events (Sample Events)

The application includes **sample/demo events** that can be booked without actual payment processing. These events are shown when:

1. No events are found at the user's location
2. User filters events and no matches are found

### How to Book Demo Events

1. **Browse Events:** Navigate to the Events page
2. **Find Sample Events:** Look for events with a "Sample" badge
3. **Click "View & Book":** Click on any sample event card
4. **Select Tickets:** Choose the number of tickets
5. **Book Demo Event:** Click "Book Demo Event" button
6. **Confirmation:** You'll be redirected to a demo success page

### Demo Booking Features

- ✅ No actual payment required
- ✅ Instant booking confirmation
- ✅ Booking stored locally (in browser)
- ✅ Appears in "My Bookings" page
- ✅ Full booking flow demonstration

---

## Setting Up Stripe Test Mode

1. **Create Stripe Account:** Go to [stripe.com](https://stripe.com) and create a test account
2. **Get API Keys:** 
   - Navigate to Developers → API keys
   - Copy your **Test Secret Key** (starts with `sk_test_`)
   - Copy your **Publishable Key** (starts with `pk_test_`)
3. **Configure Webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:5000/api/payments/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret (starts with `whsec_`)
4. **Update Backend `.env`:**
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

---

## Testing the Payment Flow

### Real Events (with Stripe)

1. **Login** with test credentials
2. **Browse Events** - find real events (not sample events)
3. **Select Event** and click "View & Book"
4. **Choose Tickets** and click "Book with Stripe"
5. **Use Test Card:** Enter `4242 4242 4242 4242` in Stripe checkout
6. **Complete Payment** - booking will be confirmed

### Demo Events (Sample Events)

1. **Login** with test credentials
2. **Browse Events** - look for events with "Sample" badge
3. **Select Sample Event** and click "View & Book"
4. **Choose Tickets** and click "Book Demo Event"
5. **Instant Confirmation** - no payment required

---

## Creating Test Events

### As Admin User

1. **Login** as admin user
2. **Navigate** to Admin Dashboard (`/admin`)
3. **Fill Form** with event details:
   - Title, Description, Category
   - Venue, Location
   - Start Date, End Date
   - Price, Total Seats
   - Image URL (optional)
4. **Click** "Create Event"
5. **Event** will appear in the events list

### Using Seed Script

Run the seed script to populate the database with sample events:

```bash
cd backend
npm run seed:events
```

This will create 3 sample events in the database.

---

## Troubleshooting

### Images Not Loading
- Check if Unsplash URLs are accessible
- Images will fallback to category-colored placeholders if they fail to load

### Payment Not Working
- Ensure Stripe keys are correctly set in `.env`
- Check that webhook endpoint is configured
- Verify you're using test mode keys (not live keys)

### Demo Events Not Showing
- Demo events only show when no real events match your location/filters
- Try clearing location filter or searching for a city with no events

### Booking Not Appearing
- Real bookings: Check backend database
- Demo bookings: Check browser localStorage (they're stored locally)

---

## Quick Start Guide

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Seed Database:**
   ```bash
   cd backend
   npm run seed:events
   ```

4. **Register/Login:**
   - Go to `http://localhost:5173/register`
   - Create an account or use test credentials

5. **Test Booking:**
   - Browse events
   - Book a demo event (sample events)
   - Or book a real event with Stripe test card

---

## Support

For issues or questions:
- Check the console for error messages
- Verify all environment variables are set
- Ensure MongoDB is running and connected
- Check that Stripe test mode is enabled
