import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single testimonial fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const testimonial = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, parseInt(id)))
        .limit(1);

      if (testimonial.length === 0) {
        return NextResponse.json(
          { error: 'Testimonial not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(testimonial[0], { status: 200 });
    }

    // List testimonials with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const ratingFilter = searchParams.get('rating');

    // Start with a dynamic query
    let query = db.select().from(testimonials).$dynamic();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(testimonials.name, `%${search}%`),
          like(testimonials.role, `%${search}%`)
        )
      );
    }

    // Rating filter
    if (ratingFilter && !isNaN(parseInt(ratingFilter))) {
      conditions.push(eq(testimonials.rating, parseInt(ratingFilter)));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(
        conditions.length === 1 ? conditions[0] : and(...conditions)
      );
    }

    const results = await query
      .orderBy(desc(testimonials.createdAt))
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
    const { name, role, image, content, rating } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!role || typeof role !== 'string' || role.trim() === '') {
      return NextResponse.json(
        { error: 'Role is required', code: 'MISSING_ROLE' },
        { status: 400 }
      );
    }

    if (!image || typeof image !== 'string' || image.trim() === '') {
      return NextResponse.json(
        { error: 'Image is required', code: 'MISSING_IMAGE' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        name: name.trim(),
        role: role.trim(),
        image: image.trim(),
        content: content.trim(),
        rating: rating ?? 5,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newTestimonial[0], { status: 201 });
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

    // Check if testimonial exists
    const existing = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // Validate and sanitize fields if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = body.name.trim();
    }

    if (body.role !== undefined) {
      if (typeof body.role !== 'string' || body.role.trim() === '') {
        return NextResponse.json(
          { error: 'Role must be a non-empty string', code: 'INVALID_ROLE' },
          { status: 400 }
        );
      }
      updates.role = body.role.trim();
    }

    if (body.image !== undefined) {
      if (typeof body.image !== 'string' || body.image.trim() === '') {
        return NextResponse.json(
          { error: 'Image must be a non-empty string', code: 'INVALID_IMAGE' },
          { status: 400 }
        );
      }
      updates.image = body.image.trim();
    }

    if (body.content !== undefined) {
      if (typeof body.content !== 'string' || body.content.trim() === '') {
        return NextResponse.json(
          { error: 'Content must be a non-empty string', code: 'INVALID_CONTENT' },
          { status: 400 }
        );
      }
      updates.content = body.content.trim();
    }

    if (body.rating !== undefined) {
      if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          { error: 'Rating must be a number between 1 and 5', code: 'INVALID_RATING' },
          { status: 400 }
        );
      }
      updates.rating = body.rating;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Check if testimonial exists
    const existing = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Testimonial not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Testimonial deleted successfully',
        testimonial: deleted[0],
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