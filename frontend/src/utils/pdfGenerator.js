import jsPDF from "jspdf";

export const generateTicketPDF = (booking) => {
    if (!booking.event) {
        console.error("Cannot generate PDF: booking has no event data");
        alert("Unable to generate ticket: Event information is missing");
        return;
    }

    const doc = new jsPDF();

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("EVENT TICKET", 105, 25, { align: "center" });

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(20, 50, 170, 120, 3, 3, "FD");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.text(booking.event.title || "Unknown Event", 30, 70);

    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");

    let y = 90;
    const lineHeight = 10;

    const addLine = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 30, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 80, y);
        y += lineHeight;
    };

    const eventDate = booking.event.startDate
        ? new Date(booking.event.startDate).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
        })
        : "Date TBD";

    addLine("Date & Time:", eventDate);
    addLine("Venue:", booking.event.venue || "TBD");
    addLine("Location:", booking.event.location || "TBD");
    addLine("Quantity:", `${booking.quantity} Ticket(s)`);
    addLine("Total Paid:", `INR ${booking.totalAmount}`);
    addLine("Booking ID:", booking.bookingId || booking._id);

    y += 10;
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(30, y, 180, y);

    y += 20;
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("CHECK-IN ID", 105, y, { align: "center" });

    y += 15;
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    const checkInId = `CHK-${(booking.bookingId || booking._id || 'UNKNOWN').substring(0, 8).toUpperCase()}`;
    doc.text(checkInId, 105, y, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "italic");
    doc.text("Please show this ticket at the venue entry.", 105, 280, { align: "center" });

    doc.save(`ticket-${booking.bookingId || booking._id || 'ticket'}.pdf`);
};