import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single blog post by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const blogPost = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, parseInt(id)))
        .limit(1);

      if (blogPost.length === 0) {
        return NextResponse.json(
          { error: 'Blog post not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(blogPost[0], { status: 200 });
    }

    // List all blog posts with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const publishedParam = searchParams.get('published');
    const category = searchParams.get('category');

    let query: any = db.select().from(blogPosts);

    // Build filter conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.excerpt, `%${search}%`),
          like(blogPosts.author, `%${search}%`),
          like(blogPosts.category, `%${search}%`)
        )
      );
    }

    if (publishedParam !== null) {
      const published = publishedParam === 'true';
      conditions.push(eq(blogPosts.published, published));
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'excerpt',
      'content',
      'image',
      'author',
      'date',
      'readTime',
      'category',
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json(
          {
            error: `${field} is required`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const title = body.title.trim();
    const excerpt = body.excerpt.trim();
    const content = body.content.trim();
    const image = body.image.trim();
    const author = body.author.trim();
    const date = body.date.trim();
    const readTime = body.readTime.trim();
    const category = body.category.trim();
    const published = body.published !== undefined ? body.published : true;

    const now = new Date().toISOString();

    const newBlogPost = await db
      .insert(blogPosts)
      .values({
        title,
        excerpt,
        content,
        image,
        author,
        date,
        readTime,
        category,
        published,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newBlogPost[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error},
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

    // Check if blog post exists
    const existingBlogPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingBlogPost.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt.trim();
    if (body.content !== undefined) updates.content = body.content.trim();
    if (body.image !== undefined) updates.image = body.image.trim();
    if (body.author !== undefined) updates.author = body.author.trim();
    if (body.date !== undefined) updates.date = body.date.trim();
    if (body.readTime !== undefined) updates.readTime = body.readTime.trim();
    if (body.category !== undefined) updates.category = body.category.trim();
    if (body.published !== undefined) updates.published = body.published;

    const updatedBlogPost = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBlogPost[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
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

    // Check if blog post exists before deleting
    const existingBlogPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (existingBlogPost.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Blog post deleted successfully',
        deletedBlogPost: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error},
      { status: 500 }
    );
  }
}