import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contacts } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single contact by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const contact = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, parseInt(id)))
        .limit(1);

      if (contact.length === 0) {
        return NextResponse.json(
          { error: 'Contact not found', code: 'CONTACT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(contact[0], { status: 200 });
    }

    // List contacts with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query: any = db.select().from(contacts);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(contacts.name, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.phone, `%${search}%`),
          like(contacts.subject, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(contacts.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, status } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject is required', code: 'MISSING_SUBJECT' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required', code: 'MISSING_MESSAGE' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: status?.trim() || 'Unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newContact = await db
      .insert(contacts)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if contact exists
    const existingContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found', code: 'CONTACT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Sanitize and include provided fields
    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }
    if (body.email !== undefined) {
      updates.email = body.email.trim().toLowerCase();
    }
    if (body.phone !== undefined) {
      updates.phone = body.phone.trim();
    }
    if (body.subject !== undefined) {
      updates.subject = body.subject.trim();
    }
    if (body.message !== undefined) {
      updates.message = body.message.trim();
    }
    if (body.status !== undefined) {
      updates.status = body.status.trim();
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updatedContact = await db
      .update(contacts)
      .set(updates)
      .where(eq(contacts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedContact[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if contact exists
    const existingContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found', code: 'CONTACT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedContact = await db
      .delete(contacts)
      .where(eq(contacts.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Contact deleted successfully',
        contact: deletedContact[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}