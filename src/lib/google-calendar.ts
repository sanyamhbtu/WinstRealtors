// lib/google-calendar.ts
// Zoho Calendar configuration (Google replaced internally)

export function getCalendarClient() {
  // We don't need a client object like Google
  // Zoho works via REST APIs + access tokens
  // This function exists only to preserve compatibility
  return true;
}

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
    process.env.ZOHO_CLIENT_SECRET &&
    process.env.ZOHO_REFRESH_TOKEN
  );
}
