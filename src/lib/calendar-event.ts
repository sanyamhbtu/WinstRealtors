import { google, calendar_v3 } from 'googleapis';
import { format, parseISO, addHours } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { getCalendarClient, isCalendarConfigured } from './google-calendar';

interface CreateEventInput {
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "2:00 PM"
  duration?: number; // in minutes, default 60
  timeZone?: string; // IANA timezone, default 'America/New_York'
  attendees?: Array<{ email: string; displayName?: string }>;
  location?: string;
  calendarId?: string; // defaults to 'primary'
}

interface CreateEventResponse {
  eventId: string;
  htmlLink: string;
  status: string;
}

// Convert 12-hour time format to Date object
function parseTimeToDate(date: string, time: string): Date {
  // Parse date (YYYY-MM-DD)
  const dateParts = date.split('-');
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
  const day = parseInt(dateParts[2]);

  // Parse time (e.g., "2:00 PM")
  const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) {
    throw new Error(`Invalid time format: ${time}`);
  }

  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month, day, hours, minutes, 0);
}

export async function createCalendarEvent(
  input: CreateEventInput
): Promise<CreateEventResponse> {
  if (!isCalendarConfigured()) {
    console.warn('Google Calendar not configured, skipping event creation');
    return {
      eventId: '',
      htmlLink: '',
      status: 'not_configured',
    };
  }

  try {
    const calendar = getCalendarClient();
    const timeZone = input.timeZone || 'America/New_York';
    const duration = input.duration || 60;

    // Parse start time
    const startDate = parseTimeToDate(input.date, input.time);
    
    // Calculate end time
    const endDate = addHours(startDate, duration / 60);

    // Format for Google Calendar API (ISO 8601)
    const startDateTime = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
    const endDateTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

    const eventBody: calendar_v3.Schema$Event = {
      summary: input.title,
      description: input.description,
      location: input.location,
      start: {
        dateTime: startDateTime,
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone,
      },
      attendees:
        input.attendees?.map((a) => ({
          email: a.email,
          displayName: a.displayName,
        })) || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: input.calendarId || 'primary',
      requestBody: eventBody,
      sendUpdates: 'all', // Send email notifications to attendees
    });

    if (!response.data.id) {
      throw new Error('Failed to create event: No event ID returned');
    }

    console.log('Calendar event created:', {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    });

    return {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink || '',
      status: response.data.status || 'confirmed',
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw handleCalendarError(error);
  }
}

export async function updateCalendarEvent(
  eventId: string,
  input: Partial<CreateEventInput>,
  calendarId = 'primary'
): Promise<CreateEventResponse> {
  if (!isCalendarConfigured()) {
    console.warn('Google Calendar not configured, skipping event update');
    return {
      eventId,
      htmlLink: '',
      status: 'not_configured',
    };
  }

  try {
    const calendar = getCalendarClient();
    const timeZone = input.timeZone || 'America/New_York';

    const updateBody: calendar_v3.Schema$Event = {
      summary: input.title,
      description: input.description,
      location: input.location,
    };

    if (input.date && input.time) {
      const duration = input.duration || 60;
      const startDate = parseTimeToDate(input.date, input.time);
      const endDate = addHours(startDate, duration / 60);

      const startDateTime = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
      const endDateTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

      updateBody.start = {
        dateTime: startDateTime,
        timeZone: timeZone,
      };
      updateBody.end = {
        dateTime: endDateTime,
        timeZone: timeZone,
      };
    }

    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: updateBody,
      sendUpdates: 'all',
    });

    return {
      eventId: response.data.id || eventId,
      htmlLink: response.data.htmlLink || '',
      status: response.data.status || 'confirmed',
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw handleCalendarError(error);
  }
}

export async function deleteCalendarEvent(
  eventId: string,
  calendarId = 'primary'
): Promise<void> {
  if (!isCalendarConfigured()) {
    console.warn('Google Calendar not configured, skipping event deletion');
    return;
  }

  try {
    const calendar = getCalendarClient();
    await calendar.events.delete({ 
      calendarId, 
      eventId,
      sendUpdates: 'all',
    });
    console.log('Calendar event deleted:', eventId);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw handleCalendarError(error);
  }
}

// Error handling utility
export function handleCalendarError(error: unknown): Error {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('404')) {
      return new Error('Calendar or event not found');
    }
    if (message.includes('403')) {
      return new Error(
        'Permission denied: Check credentials and calendar access'
      );
    }
    if (message.includes('429')) {
      return new Error('Rate limited: Too many requests');
    }
    if (message.includes('401')) {
      return new Error('Authentication failed: Invalid or expired credentials');
    }

    return error;
  }

  return new Error('Unknown calendar error');
}
