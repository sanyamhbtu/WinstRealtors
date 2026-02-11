import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { partners } from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single partner fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const partner = await db
        .select()
        .from(partners)
        .where(eq(partners.id, parseInt(id)))
        .limit(1);

      if (partner.length === 0) {
        return NextResponse.json(
          { error: 'Partner not found', code: 'PARTNER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(partner[0], { status: 200 });
    }

    // List partners with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    // Use a permissive type to avoid incompatible select-base variations when chaining conditional clauses
    let query = db.select().from(partners).$dynamic();

    if (search) {
      query = query.where(like(partners.name, `%${search}%`));
    }

    query = query.orderBy(desc(partners.createdAt));

    const results = await query.limit(limit).offset(offset);

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
    const { name, logo, website } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!logo) {
      return NextResponse.json(
        { error: 'Logo is required', code: 'MISSING_LOGO' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedLogo = logo.trim();
    const sanitizedWebsite = website?.trim();

    // Create new partner
    const timestamp = new Date().toISOString();
    const newPartner = await db
      .insert(partners)
      .values({
        name: sanitizedName,
        logo: sanitizedLogo,
        website: sanitizedWebsite || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    return NextResponse.json(newPartner[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if partner exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    if (existingPartner.length === 0) {
      return NextResponse.json(
        { error: 'Partner not found', code: 'PARTNER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    // Build update object with provided fields
    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }

    if (body.logo !== undefined) {
      updates.logo = body.logo.trim();
    }

    if (body.website !== undefined) {
      updates.website = body.website ? body.website.trim() : null;
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    // Update partner
    const updatedPartner = await db
      .update(partners)
      .set(updates)
      .where(eq(partners.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedPartner[0], { status: 200 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if partner exists
    const existingPartner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    if (existingPartner.length === 0) {
      return NextResponse.json(
        { error: 'Partner not found', code: 'PARTNER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete partner
    const deleted = await db
      .delete(partners)
      .where(eq(partners.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Partner deleted successfully',
        partner: deleted[0],
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