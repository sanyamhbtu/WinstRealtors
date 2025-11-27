import { google } from 'googleapis';

interface CalendarCredentials {
  type: 'service_account';
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export function getCalendarClient() {
  try {
    const credentialsStr = process.env.GOOGLE_CALENDAR_CREDENTIALS;
    
    if (!credentialsStr) {
      throw new Error('GOOGLE_CALENDAR_CREDENTIALS not configured');
    }

    const credentials = JSON.parse(credentialsStr) as CalendarCredentials;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Calendar client:', error);
    throw new Error('Google Calendar is not properly configured');
  }
}

export function isCalendarConfigured(): boolean {
  return !!process.env.GOOGLE_CALENDAR_CREDENTIALS;
}
