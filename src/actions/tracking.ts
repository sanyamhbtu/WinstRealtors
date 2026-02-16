'use server';

import { db } from '@/db';
import { trafficLogs } from '@/db/schema';
import { headers } from 'next/headers';

export async function logVisit(path: string) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Simple hash for privacy (in a real app, use a proper hashing library)
    // For now, we'll store specific parts or just the raw IP if privacy isn't strict yet,
    // but let's do a basic masking.
    const ipHash = ip === 'unknown' ? 'unknown' : ip.split(',')[0]; // taking first IP if multiple

    // Country/City would need a geolocation service (e.g. Vercel headers), 
    // for now we'll just log what we can.
    const country = headersList.get('x-vercel-ip-country') || null;
    const city = headersList.get('x-vercel-ip-city') || null;

    await db.insert(trafficLogs).values({
      path,
      userAgent,
      ipHash,
      country,
      city,
    });
  } catch (error) {
    console.error('Failed to log visit:', error);
    // Don't throw, we don't want to break the page for the user
  }
}
