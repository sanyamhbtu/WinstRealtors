import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { galleryItems } from '@/db/schema';
import { eq, like, or, asc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single gallery item by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const galleryItem = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.id, parseInt(id)))
        .limit(1);

      if (galleryItem.length === 0) {
        return NextResponse.json(
          { error: 'Gallery item not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(galleryItem[0], { status: 200 });
    }

    // List all gallery items with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const publishedParam = searchParams.get('published');
    const categoryParam = searchParams.get('category');

    let query: any = db.select().from(galleryItems);

    // Build where conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(galleryItems.title, `%${search}%`),
          like(galleryItems.category, `%${search}%`)
        )
      );
    }

    if (publishedParam !== null) {
      const publishedValue = publishedParam === 'true';
      conditions.push(eq(galleryItems.published, publishedValue));
    }

    if (categoryParam) {
      conditions.push(eq(galleryItems.category, categoryParam));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(asc(galleryItems.orderIndex))
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
    const { title, image, category, description, orderIndex, published } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required', code: 'MISSING_IMAGE' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedImage = image.trim();
    const sanitizedCategory = category.trim();
    const sanitizedDescription = description ? description.trim() : null;

    // Prepare insert data with defaults
    const insertData = {
      title: sanitizedTitle,
      image: sanitizedImage,
      category: sanitizedCategory,
      description: sanitizedDescription,
      orderIndex: orderIndex !== undefined ? orderIndex : 0,
      published: published !== undefined ? published : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newGalleryItem = await db
      .insert(galleryItems)
      .values(insertData)
      .returning();

    return NextResponse.json(newGalleryItem[0], { status: 201 });
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

    // Check if gallery item exists
    const existingGalleryItem = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, parseInt(id)))
      .limit(1);

    if (existingGalleryItem.length === 0) {
      return NextResponse.json(
        { error: 'Gallery item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    // Process updates for allowed fields
    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }
    if (body.image !== undefined) {
      updates.image = body.image.trim();
    }
    if (body.category !== undefined) {
      updates.category = body.category.trim();
    }
    if (body.description !== undefined) {
      updates.description = body.description ? body.description.trim() : null;
    }
    if (body.orderIndex !== undefined) {
      updates.orderIndex = body.orderIndex;
    }
    if (body.published !== undefined) {
      updates.published = body.published;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updatedGalleryItem = await db
      .update(galleryItems)
      .set(updates)
      .where(eq(galleryItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedGalleryItem[0], { status: 200 });
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

    // Check if gallery item exists
    const existingGalleryItem = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, parseInt(id)))
      .limit(1);

    if (existingGalleryItem.length === 0) {
      return NextResponse.json(
        { error: 'Gallery item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(galleryItems)
      .where(eq(galleryItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Gallery item deleted successfully',
        galleryItem: deleted[0],
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