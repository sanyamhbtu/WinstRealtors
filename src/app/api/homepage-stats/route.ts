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
    const body = await request.json();
    
    // Check if initialization is needed (if table is empty)
    if (body.action === 'initialize') {
      const existing = await db.select().from(homepageStats).limit(1);
      if (existing.length === 0) {
        const defaults = [
          { label: "Happy Clients", value: "200+", icon: "Star", orderIndex: 1 },
          { label: "Years Experience", value: "25+", icon: "Award", orderIndex: 2 },
          { label: "Total Sales Value", value: "₹25.5L+", icon: "DollarSign", orderIndex: 3 },
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
    
    if (id) {
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
        .where(eq(homepageStats.id, id))
        .returning();
        
      return NextResponse.json(updated[0], { status: 200 });
    } else {
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
    }

  } catch (error) {
    console.error('POST error:', error);
     return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
