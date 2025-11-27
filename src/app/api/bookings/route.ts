import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';
import { createCalendarEvent, deleteCalendarEvent } from '@/lib/calendar-event';
import { isCalendarConfigured } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single booking by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const booking = await db.select()
        .from(bookings)
        .where(eq(bookings.id, parseInt(id)))
        .limit(1);

      if (booking.length === 0) {
        return NextResponse.json({ 
          error: 'Booking not found',
          code: "BOOKING_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(booking[0], { status: 200 });
    }

    // List bookings with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    const baseQuery = db.select().from(bookings);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(bookings.name, `%${search}%`),
          like(bookings.email, `%${search}%`),
          like(bookings.phone, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(bookings.status, status));
    }

    if (date) {
      conditions.push(eq(bookings.date, date));
    }

    const query = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    const results = await query
      .orderBy(desc(bookings.date))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, propertyType, budget, location, message, status, notes } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ 
        error: "Phone is required",
        code: "MISSING_PHONE" 
      }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ 
        error: "Date is required",
        code: "MISSING_DATE" 
      }, { status: 400 });
    }

    if (!time) {
      return NextResponse.json({ 
        error: "Time is required",
        code: "MISSING_TIME" 
      }, { status: 400 });
    }

    // Prepare insert data with defaults and auto-generated fields
    const timestamp = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date: date.trim(),
      time: time.trim(),
      propertyType: propertyType?.trim() || null,
      budget: budget?.trim() || null,
      location: location?.trim() || null,
      message: message?.trim() || null,
      status: status?.trim() || 'Pending',
      notes: notes?.trim() || null,
      googleCalendarEventId: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newBooking = await db.insert(bookings)
      .values(insertData)
      .returning();

    return NextResponse.json(newBooking[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json({ 
        error: 'Booking not found',
        code: "BOOKING_NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, phone, date, time, propertyType, budget, location, message, status, notes } = body;

    const oldBooking = existingBooking[0];
    const oldStatus = oldBooking.status;
    const newStatus = status || oldStatus;

    // Prepare update data (only include provided fields)
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (date !== undefined) updateData.date = date.trim();
    if (time !== undefined) updateData.time = time.trim();
    if (propertyType !== undefined) updateData.propertyType = propertyType?.trim() || null;
    if (budget !== undefined) updateData.budget = budget?.trim() || null;
    if (location !== undefined) updateData.location = location?.trim() || null;
    if (message !== undefined) updateData.message = message?.trim() || null;
    if (status !== undefined) updateData.status = status.trim();
    if (notes !== undefined) updateData.notes = notes?.trim() || null;

    // Handle Google Calendar integration when status changes to "Confirmed"
    if (oldStatus !== 'Confirmed' && newStatus === 'Confirmed') {
      try {
        if (isCalendarConfigured()) {
          const calendarEvent = await createCalendarEvent({
            title: `Consultation: ${oldBooking.name}`,
            description: `
Consultation Details:
- Client: ${oldBooking.name}
- Email: ${oldBooking.email}
- Phone: ${oldBooking.phone}
${oldBooking.propertyType ? `- Property Type: ${oldBooking.propertyType}` : ''}
${oldBooking.budget ? `- Budget: ${oldBooking.budget}` : ''}
${oldBooking.location ? `- Preferred Location: ${oldBooking.location}` : ''}
${oldBooking.message ? `\nMessage:\n${oldBooking.message}` : ''}
            `.trim(),
            date: updateData.date || oldBooking.date,
            time: updateData.time || oldBooking.time,
            duration: 60, // 1 hour consultation
            attendees: [
              { 
                email: updateData.email || oldBooking.email,
                displayName: updateData.name || oldBooking.name
              }
            ],
            location: updateData.location || oldBooking.location || undefined,
          });

          if (calendarEvent.eventId) {
            updateData.googleCalendarEventId = calendarEvent.eventId;
            console.log('Google Calendar event created:', calendarEvent.eventId);
          }
        }
      } catch (calendarError) {
        console.error('Failed to create calendar event:', calendarError);
        // Don't fail the booking update if calendar creation fails
      }
    }

    // Handle Google Calendar event deletion when status changes to "Cancelled"
    if (oldStatus === 'Confirmed' && newStatus === 'Cancelled' && oldBooking.googleCalendarEventId) {
      try {
        if (isCalendarConfigured()) {
          await deleteCalendarEvent(oldBooking.googleCalendarEventId);
          updateData.googleCalendarEventId = null;
          console.log('Google Calendar event deleted:', oldBooking.googleCalendarEventId);
        }
      } catch (calendarError) {
        console.error('Failed to delete calendar event:', calendarError);
        // Don't fail the booking update if calendar deletion fails
      }
    }

    const updatedBooking = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBooking[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json({ 
        error: 'Booking not found',
        code: "BOOKING_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete Google Calendar event if it exists
    const booking = existingBooking[0];
    if (booking.googleCalendarEventId && isCalendarConfigured()) {
      try {
        await deleteCalendarEvent(booking.googleCalendarEventId);
        console.log('Google Calendar event deleted:', booking.googleCalendarEventId);
      } catch (calendarError) {
        console.error('Failed to delete calendar event:', calendarError);
        // Continue with booking deletion even if calendar deletion fails
      }
    }

    const deletedBooking = await db.delete(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Booking deleted successfully',
      booking: deletedBooking[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}