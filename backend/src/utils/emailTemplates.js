export const generateTicketEmailHTML = (booking) => {
  const event = booking.event;
  const user = booking.user;
  const eventDate = new Date(event.startDate).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; }
    .ticket-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .ticket-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .ticket-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #475569; }
    .value { color: #1e293b; }
    .check-in-box { background: #eff6ff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .check-in-id { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px; margin: 10px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    @media only screen and (max-width: 600px) {
      .ticket-row { flex-direction: column; }
      .label, .value { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Your ticket for ${event.title}</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Thank you for booking with EventNest! Your payment has been successfully processed.</p>
      
      <div class="ticket-box">
        <h2 style="margin-top: 0; color: #1e293b;">Event Details</h2>
        <div class="ticket-row">
          <span class="label">Event:</span>
          <span class="value">${event.title}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Date & Time:</span>
          <span class="value">${eventDate}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Venue:</span>
          <span class="value">${event.venue}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Location:</span>
          <span class="value">${event.location}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Quantity:</span>
          <span class="value">${booking.quantity} Ticket(s)</span>
        </div>
        <div class="ticket-row">
          <span class="label">Total Paid:</span>
          <span class="value">₹${booking.totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div class="ticket-row">
          <span class="label">Booking ID:</span>
          <span class="value">${booking.bookingId}</span>
        </div>
      </div>

      <div class="check-in-box">
        <p style="margin: 0; color: #2563eb; font-weight: bold;">CHECK-IN ID</p>
        <div class="check-in-id">CHK-${booking.bookingId.substring(0, 8).toUpperCase()}</div>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;">Show this ID at the venue entry</p>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/bookings" class="button">View My Bookings</a>
      </p>

      <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
        <strong>Important:</strong> Please arrive at the venue at least 15 minutes before the event starts. 
        You can download your ticket PDF from the "My Bookings" page.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0;">Thank you for using EventNest!</p>
      <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} EventNest. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};