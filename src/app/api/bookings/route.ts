import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/mail';
import { eq, like, or, desc, and, type SQL } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single booking by ID
    if (id) {
      if (isNaN(parseInt(id))) {
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

    // Build where conditions
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(
        or(
          like(bookings.name, `%${search}%`),
          like(bookings.email, `%${search}%`),
          like(bookings.phone, `%${search}%`)
        )! // Non-null assertion strictly for the OR construction if needed
      );
    }

    if (status) {
      conditions.push(eq(bookings.status, status));
    }

    if (date) {
      conditions.push(eq(bookings.date, date));
    }

    // execute query
    const results = await db.select()
      .from(bookings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
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
    if (!name) return NextResponse.json({ error: "Name is required", code: "MISSING_NAME" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required", code: "MISSING_EMAIL" }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Phone is required", code: "MISSING_PHONE" }, { status: 400 });
    if (!date) return NextResponse.json({ error: "Date is required", code: "MISSING_DATE" }, { status: 400 });
    if (!time) return NextResponse.json({ error: "Time is required", code: "MISSING_TIME" }, { status: 400 });

    const timestamp = new Date().toISOString();
    
    // Type-safe insertion object
    const insertData: typeof bookings.$inferInsert = {
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
      return NextResponse.json({ error: "Valid ID is required", code: "INVALID_ID" }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json({ error: 'Booking not found', code: "BOOKING_NOT_FOUND" }, { status: 404 });
    }

    const body = await request.json();
    const { name, email, phone, date, time, propertyType, budget, location, message, status, notes } = body;

    const oldBooking = existingBooking[0];
    const oldStatus = oldBooking.status;
    const newStatus = status || oldStatus;

    // Use Partial of the schema insert type for type safety
    const updateData: Partial<typeof bookings.$inferInsert> = {
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

    // Handle Email Notifications for Status Changes
    if (oldStatus !== 'Confirmed' && newStatus === 'Confirmed') {
      const eventName = updateData.name ?? oldBooking.name;
      const eventEmail = updateData.email ?? oldBooking.email;
      const eventDate = updateData.date ?? oldBooking.date;
      const eventTime = updateData.time ?? oldBooking.time;
      const eventMsg = updateData.message ?? oldBooking.message;
      const eventLoc = updateData.location ?? oldBooking.location;

      await sendBookingConfirmation({
        name: eventName,
        email: eventEmail,
        date: eventDate,
        time: eventTime,
        title: `Consultation with ${eventName}`,
        description: eventMsg || undefined,
        location: eventLoc || undefined,
        duration: 60
      });
    }

    if (oldStatus === 'Confirmed' && newStatus === 'Cancelled') {
      const eventName = updateData.name ?? oldBooking.name;
      const eventEmail = updateData.email ?? oldBooking.email;
      const eventDate = updateData.date ?? oldBooking.date;
      const eventTime = updateData.time ?? oldBooking.time;

      await sendBookingCancellation({
        name: eventName,
        email: eventEmail,
        date: eventDate,
        time: eventTime,
        title: `Consultation with ${eventName}`
      });
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
      return NextResponse.json({ error: "Valid ID is required", code: "INVALID_ID" }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json({ error: 'Booking not found', code: "BOOKING_NOT_FOUND" }, { status: 404 });
    }

    const booking = existingBooking[0];

    // Send cancellation email if it was confirmed
    if (booking.status === 'Confirmed') {
      await sendBookingCancellation({
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        title: `Consultation with ${booking.name}`
      });
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