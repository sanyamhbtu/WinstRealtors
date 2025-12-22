import nodemailer from "nodemailer";
import { addMinutes, format } from "date-fns";

/* ================= TYPES ================= */

interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: number;
  timeZone?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  location?: string;
  calendarId?: string;
}

interface CreateEventResponse {
  eventId: string;
  htmlLink: string;
  status: string;
}

/* ================= EMAIL SETUP ================= */

function getMailer() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("SMTP not configured");
    throw new Error("SMTP not configured");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/* ================= HELPERS ================= */

function parseDateTime(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [, h, min, ap] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)!;

  let hour = Number(h);
  if (ap.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (ap.toUpperCase() === "AM" && hour === 12) hour = 0;

  return new Date(y, m - 1, d, hour, Number(min));
}

/* ================= EMAIL TEMPLATES ================= */

async function sendClientMail(input: CreateEventInput) {
  const mailer = getMailer();
  const start = parseDateTime(input.date, input.time);
  const end = addMinutes(start, input.duration ?? 60);

  await mailer.sendMail({
    from: `"Winst Realtors" <${process.env.SMTP_USER}>`,
    to: input.attendees?.[0]?.email || "",
    subject: `Your Appointment is Confirmed - ${input.date} ${input.time}`,
    html: `
      <h2>Appointment Confirmed 🎉</h2>

      <p>Your consultation with <b>Winst Realtors</b> is confirmed.</p>

      <b>Topic:</b> ${input.title}<br/>
      <b>Date:</b> ${input.date}<br/>
      <b>Time:</b> ${input.time}<br/>
      <b>Ends:</b> ${format(end, "hh:mm a")}<br/>
      ${input.location ? `<b>Location:</b> ${input.location}<br/>` : ""}

      ${input.description ? `<p>${input.description}</p>` : ""}

      <p>Our team will contact you shortly.</p>
      <br/>
      <strong>Winst Realtors</strong>
    `,
  });
}

async function sendAdminMail(input: CreateEventInput) {
  const mailer = getMailer();
  const start = parseDateTime(input.date, input.time);
  const end = addMinutes(start, input.duration ?? 60);

  const smtpUser = process.env.SMTP_USER || "noreply@winstrealtors.com";

  await mailer.sendMail({
  from: `"Winst Realtors System" <${smtpUser}>`,
  to: [
    process.env.ADMIN_EMAIL || smtpUser,
    "sales@winstrealtors.com"
  ].filter(Boolean),
  subject: `NEW CONFIRMED BOOKING - ${input.title}`,
  html: `
    <h2>New Confirmed Booking</h2>
    <b>Title:</b> ${input.title}<br/>
    <b>Date:</b> ${input.date}<br/>
    <b>Time:</b> ${input.time}<br/>
    <b>Ends:</b> ${format(end, "hh:mm a")}<br/>
    ${input.location ? `<b>Location:</b> ${input.location}<br/>` : ""}
    ${
      input.attendees?.length
        ? `<b>Client:</b> ${input.attendees[0].email}<br/>`
        : ""
    }
    ${input.description ? `<p>${input.description}</p>` : ""}
    <hr/>
    <p>Login admin panel for more details.</p>
  `,
});

}

/* ================= CREATE EVENT ================= */

export async function createCalendarEvent(
  input: CreateEventInput
): Promise<CreateEventResponse> {
  try {
    await sendClientMail(input);
    await sendAdminMail(input);

    return {
      eventId: "smtp-email",
      htmlLink: "",
      status: "confirmed",
    };
  } catch (e) {
    console.error("EMAIL ERROR:", e);
    throw new Error("Failed to send confirmation emails");
  }
}

/* ================= UPDATE EVENT ================= */

export async function updateCalendarEvent(
  eventId: string,
  input: Partial<CreateEventInput>
): Promise<CreateEventResponse> {
  try {
    // Optional: send reschedule email later if needed
    return { eventId, htmlLink: "", status: "confirmed" };
  } catch (e) {
    console.error("EMAIL ERROR:", e);
    throw new Error("Failed to update booking email");
  }
}

/* ================= DELETE EVENT ================= */

export async function deleteCalendarEvent() {
  // Optional: send cancellation email if you want later
  return;
}

/* ================= ERROR HANDLER ================= */

export function handleCalendarError(error: unknown): Error {
  console.error("EMAIL MODULE ERROR:", error);
  return new Error("Email System Error");
}
