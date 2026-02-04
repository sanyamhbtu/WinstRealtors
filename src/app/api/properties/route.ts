import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';
  
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    // Single property fetch
    if (id) {
      // if (!id || isNaN(parseInt(id))) {
      //   return NextResponse.json(
      //     { error: 'Valid ID is required', code: 'INVALID_ID' },
      //     { status: 400 }
      //   );
      // }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
          { status: 404 }
        );
      }
      

      // Parse images JSON string to array
      const propertyData = {
        ...property[0],
        images: parseImages(property[0].images)
      };

      return NextResponse.json(propertyData, { status: 200 });
    }

    // List properties with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') ?? 'createdAt';
    const order = searchParams.get('order') ?? 'desc';

    let query: any = db.select().from(properties);
    function parseImages(value: any) {
        try {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          return JSON.parse(value);
        } catch {
          return [];
        }
    }

    // Build filter conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(properties.title, `%${search}%`),
          like(properties.location, `%${search}%`),
          like(properties.category, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(properties.status, status));
    }

    if (featured !== null) {
      const val = featured === "true" || featured === "1";
  conditions.push(eq(properties.featured, val));
    }

    if (type) {
      conditions.push(eq(properties.type, type));
    }

    if (category) {
      conditions.push(eq(properties.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const allowedSorts = ["createdAt", "price", "title", "category"];
const sortKey = allowedSorts.includes(sort) ? sort : "createdAt";
const sortColumn = (properties as any)[sortKey];

    if (order === 'asc') {
      query = query.orderBy(sortColumn);
    } else {
      query = query.orderBy(desc(sortColumn));
    }

    const results = await query.limit(limit).offset(offset);

    // Parse images for all properties

    const parsedResults = results.map((p: any) => ({
  ...p,
  images: parseImages(p.images),
}));

    return NextResponse.json(parsedResults, { status: 200 });
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

    // Validate required fields
    const requiredFields = [
      'title',
      'location',
      'price',
      'image',
      'bedrooms',
      'bathrooms',
      'area',
      'type',
      'category',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          {
            error: `${field} is required`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Validate bedrooms and bathrooms are numbers
    if (isNaN(parseInt(body.bedrooms))) {
      return NextResponse.json(
        { error: 'Bedrooms must be a valid number', code: 'INVALID_BEDROOMS' },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(body.bathrooms))) {
      return NextResponse.json(
        { error: 'Bathrooms must be a valid number', code: 'INVALID_BATHROOMS' },
        { status: 400 }
      );
    }

    // Validate images field if provided
    let imagesArray: string[] = [];
    if (body.images !== undefined) {
      if (Array.isArray(body.images)) {
        // Validate all items are strings
        if (!body.images.every((img: any) => typeof img === 'string')) {
          return NextResponse.json(
            { error: 'All image URLs must be strings', code: 'INVALID_IMAGES_FORMAT' },
            { status: 400 }
          );
        }
        imagesArray = body.images;
      } else {
        return NextResponse.json(
          { error: 'Images must be an array', code: 'INVALID_IMAGES_TYPE' },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const sanitizedData = {
      title: body.title.trim(),
      location: body.location.trim(),
      price: body.price.trim(),
      image: body.image.trim(),
      images: imagesArray,
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      area: body.area.trim(),
      type: body.type.trim(),
      category: body.category.trim(),
      description: body.description ? body.description.trim() : null,
      featured: body.featured ?? false,
      status: body.status ?? 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newProperty = await db
      .insert(properties)
      .values(sanitizedData)
      .returning();

    // Parse images for response
    const responseData = {
      ...newProperty[0],
      images: newProperty[0].images || []
    };

    return NextResponse.json(responseData, { status: 201 });
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

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update object with only provided fields
    const updates: Record<string, any> = {};
    updates.updatedAt = new Date().toISOString();

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.price !== undefined) updates.price = body.price.trim();
    if (body.image !== undefined) updates.image = body.image.trim();
    
    // Handle images field with validation
    if (body.images !== undefined) {
      if (Array.isArray(body.images)) {
        // Validate all items are strings
        if (!body.images.every((img: any) => typeof img === 'string')) {
          return NextResponse.json(
            { error: 'All image URLs must be strings', code: 'INVALID_IMAGES_FORMAT' },
            { status: 400 }
          );
        }
        updates.images = body.images;
      } else {
        return NextResponse.json(
          { error: 'Images must be an array', code: 'INVALID_IMAGES_TYPE' },
          { status: 400 }
        );
      }
    }
    
    if (body.bedrooms !== undefined) {
      if (isNaN(parseInt(body.bedrooms))) {
        return NextResponse.json(
          { error: 'Bedrooms must be a valid number', code: 'INVALID_BEDROOMS' },
          { status: 400 }
        );
      }
      updates.bedrooms = parseInt(body.bedrooms);
    }
    if (body.bathrooms !== undefined) {
      if (isNaN(parseInt(body.bathrooms))) {
        return NextResponse.json(
          { error: 'Bathrooms must be a valid number', code: 'INVALID_BATHROOMS' },
          { status: 400 }
        );
      }
      updates.bathrooms = parseInt(body.bathrooms);
    }
    if (body.area !== undefined) updates.area = body.area.trim();
    if (body.type !== undefined) updates.type = body.type.trim();
    if (body.category !== undefined) updates.category = body.category.trim();
    if (body.description !== undefined)
      updates.description = body.description ? body.description.trim() : null;
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.status !== undefined) updates.status = body.status.trim();

    const updatedProperty = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    // Parse images for response
    const responseData = {
      ...updatedProperty[0],
      images: updatedProperty[0].images || []
    };

    return NextResponse.json(responseData, { status: 200 });
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

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedProperty = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Property deleted successfully',
        property: deletedProperty[0],
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