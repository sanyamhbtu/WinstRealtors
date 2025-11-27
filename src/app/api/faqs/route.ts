import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, like, or, asc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single FAQ fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const faq = await db
        .select()
        .from(faqs)
        .where(eq(faqs.id, parseInt(id)))
        .limit(1);

      if (faq.length === 0) {
        return NextResponse.json(
          { error: 'FAQ not found', code: 'FAQ_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(faq[0], { status: 200 });
    }

    // List FAQs with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const published = searchParams.get('published');
    const category = searchParams.get('category');

    let query: any = db.select().from(faqs);

    // Build where conditions
    const conditions = [];

    // Search across question, answer, and category
    if (search) {
      conditions.push(
        or(
          like(faqs.question, `%${search}%`),
          like(faqs.answer, `%${search}%`),
          like(faqs.category, `%${search}%`)
        )
      );
    }

    // Filter by published status
    if (published !== null && published !== undefined) {
      const isPublished = published === 'true';
      conditions.push(eq(faqs.published, isPublished));
    }

    // Filter by category
    if (category) {
      conditions.push(eq(faqs.category, category));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by orderIndex ASC by default
    const results = await query
      .orderBy(asc(faqs.orderIndex))
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
    const { question, answer, category, orderIndex, published } = body;

    // Validate required fields
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json(
        { error: 'Question is required and must be a non-empty string', code: 'MISSING_QUESTION' },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== 'string' || answer.trim() === '') {
      return NextResponse.json(
        { error: 'Answer is required and must be a non-empty string', code: 'MISSING_ANSWER' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const now = new Date().toISOString();
    const newFaq = await db
      .insert(faqs)
      .values({
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        published: published !== undefined ? published : true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newFaq[0], { status: 201 });
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

    // Check if FAQ exists
    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found', code: 'FAQ_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Only include fields that are provided in the request
    if (body.question !== undefined) {
      if (typeof body.question !== 'string' || body.question.trim() === '') {
        return NextResponse.json(
          { error: 'Question must be a non-empty string', code: 'INVALID_QUESTION' },
          { status: 400 }
        );
      }
      updates.question = body.question.trim();
    }

    if (body.answer !== undefined) {
      if (typeof body.answer !== 'string' || body.answer.trim() === '') {
        return NextResponse.json(
          { error: 'Answer must be a non-empty string', code: 'INVALID_ANSWER' },
          { status: 400 }
        );
      }
      updates.answer = body.answer.trim();
    }

    if (body.category !== undefined) {
      if (typeof body.category !== 'string' || body.category.trim() === '') {
        return NextResponse.json(
          { error: 'Category must be a non-empty string', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = body.category.trim();
    }

    if (body.orderIndex !== undefined) {
      updates.orderIndex = parseInt(body.orderIndex);
    }

    if (body.published !== undefined) {
      updates.published = body.published;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(faqs)
      .set(updates)
      .where(eq(faqs.id, parseInt(id)))
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if FAQ exists before deleting
    const existingFaq = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .limit(1);

    if (existingFaq.length === 0) {
      return NextResponse.json(
        { error: 'FAQ not found', code: 'FAQ_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(faqs)
      .where(eq(faqs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'FAQ deleted successfully',
        deletedFaq: deleted[0],
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