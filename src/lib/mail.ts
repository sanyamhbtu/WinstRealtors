import nodemailer from "nodemailer";
import { format, addMinutes } from "date-fns";

interface BookingEmailInput {
  name: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm AM/PM
  title?: string;
  description?: string;
  location?: string;
  duration?: number; // minutes
}

function getMailer() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.warn("SMTP not configured");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function parseDateTime(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  
  // Try 12-hour format first (e.g. "02:30 PM")
  const match12 = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match12) {
    const [, h, min, ap] = match12;
    let hour = Number(h);
    if (ap.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ap.toUpperCase() === "AM" && hour === 12) hour = 0;
    return new Date(y, m - 1, d, hour, Number(min));
  }

  // Try 24-hour format (e.g. "14:30")
  const match24 = time.match(/(\d+):(\d+)/);
  if (match24) {
    const [, h, min] = match24;
    return new Date(y, m - 1, d, Number(h), Number(min));
  }

  // Fallback
  return new Date(y, m - 1, d, 0, 0); 
}

export async function sendBookingConfirmation(booking: BookingEmailInput) {
  const mailer = getMailer();
  if (!mailer) return;

  const start = parseDateTime(booking.date, booking.time);
  const end = addMinutes(start, booking.duration ?? 60);
  const formattedDate = format(start, "MMMM do, yyyy");
  const formattedTime = format(start, "hh:mm a");
  const formattedEndTime = format(end, "hh:mm a");

  try {
    // 1. Send Client Email
    await mailer.sendMail({
      from: `"Winst Realtors" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Confirmed: ${booking.title || 'Consultation'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Appointment Confirmed 🎉</h2>
          <p>Your consultation with <b>Winst Realtors</b> is confirmed.</p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Topic:</b> ${booking.title || 'Consultation'}</p>
            <p style="margin: 5px 0;"><b>Date:</b> ${formattedDate}</p>
            <p style="margin: 5px 0;"><b>Time:</b> ${formattedTime} - ${formattedEndTime}</p>
            ${booking.location ? `<p style="margin: 5px 0;"><b>Location:</b> ${booking.location}</p>` : ""}
          </div>

          ${booking.description ? `<p>${booking.description}</p>` : ""}

          <p>Our team will contact you shortly.</p>
          <br/>
          <strong>Winst Realtors Team</strong>
        </div>
      `,
    });

    // 2. Send Admin Email
    const smtpUser = process.env.SMTP_USER || "noreply@winstrealtors.com";
    await mailer.sendMail({
      from: `"Winst System" <${smtpUser}>`,
      to: [
        process.env.ADMIN_EMAIL || smtpUser,
        "sales@winstrealtors.com"
      ].filter(Boolean),
      subject: `NEW BOOKING: ${booking.name}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Confirmed Booking</h2>
          <p><b>Client:</b> ${booking.name} (${booking.email})</p>
          <p><b>Date:</b> ${formattedDate}</p>
          <p><b>Time:</b> ${formattedTime}</p>
          ${booking.location ? `<p><b>Location:</b> ${booking.location}</p>` : ""}
          <hr/>
          ${booking.description ? `<p><b>Message:</b><br/>${booking.description}</p>` : ""}
        </div>
      `,
    });

    console.log(`[Mail] Booking confirmation sent to ${booking.email}`);
  } catch (error) {
    console.error("[Mail] Failed to send booking confirmation:", error);
    // We don't throw here to avoid failing the API request if email fails, 
    // but in a production system you might want a queue.
  }
}

export async function sendBookingCancellation(booking: BookingEmailInput) {
  const mailer = getMailer();
  if (!mailer) return;

  try {
    await mailer.sendMail({
      from: `"Winst Realtors" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Cancelled: ${booking.title || 'Consultation'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Appointment Cancelled</h2>
          <p>Your consultation scheduled for <b>${booking.date} at ${booking.time}</b> has been cancelled.</p>
          <p>If you did not request this, please contact us immediately.</p>
          <br/>
          <strong>Winst Realtors Team</strong>
        </div>
      `,
    });
    console.log(`[Mail] Booking cancellation sent to ${booking.email}`);
  } catch (error) {
    console.error("[Mail] Failed to send cancellation email:", error);
  }
}
