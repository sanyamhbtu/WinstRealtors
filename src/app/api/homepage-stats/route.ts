import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageStats } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const stats = await db
      .select()
      .from(homepageStats)
      .orderBy(asc(homepageStats.orderIndex));
    
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    // Check if initialization is needed (if table is empty)
    if (body.action === 'initialize') {
      const existing = await db.select().from(homepageStats).limit(1);
      if (existing.length === 0) {
        const defaults = [
          { label: "Happy Clients", value: "200+", icon: "Star", orderIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { label: "Years Experience", value: "25+", icon: "Award", orderIndex: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { label: "Total Sales Value", value: "₹25.5L+", icon: "DollarSign", orderIndex: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        const result = await db.insert(homepageStats).values(defaults).returning();
        return NextResponse.json(result, { status: 201 });
      }
      return NextResponse.json({ message: "Already initialized" }, { status: 200 });
    }

    const { id, label, value, icon, orderIndex } = body;
    
    if (!label || !value) {
       return NextResponse.json(
        { error: 'Label and Value are required' },
        { status: 400 }
      );
    }
    
    // Create new
    const created = await db
      .insert(homepageStats)
      .values({
           label,
           value,
           icon: icon || 'Star',
           orderIndex: orderIndex || 0,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString()
      })
      .returning();
      
    return NextResponse.json(created[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
     return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchId = searchParams.get('id');
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { id, label, value, icon, orderIndex } = body;
    
    // Allow ID from either URL params or body
    const targetId = searchId ? parseInt(searchId) : id;

    if (!targetId) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }

    if (!label || !value) {
       return NextResponse.json(
        { error: 'Label and Value are required' },
        { status: 400 }
      );
    }
    
    // Update existing
    const updated = await db
      .update(homepageStats)
      .set({
        label,
        value,
        icon: icon || 'Star',
        orderIndex: orderIndex || 0,
        updatedAt: new Date().toISOString()
      })
      .where(eq(homepageStats.id, targetId))
      .returning();
      
    if (updated.length === 0) {
        return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
      return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
