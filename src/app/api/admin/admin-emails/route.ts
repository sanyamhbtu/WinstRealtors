import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminEmails, user, account, session } from '@/db/schema';
import { eq, and, gt, desc } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { generateId } from 'better-auth';

async function authenticateRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    if (!token) {
      return null;
    }

    const sessions = await db.select()
      .from(session)
      .where(and(
        eq(session.token, token),
        gt(session.expiresAt, new Date())
      ))
      .limit(1);

    if (sessions.length === 0) {
      return null;
    }

    const users = await db.select()
      .from(user)
      .where(eq(user.id, sessions[0].userId))
      .limit(1);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

async function isAdmin(email: string): Promise<boolean> {
  try {
    const admins = await db.select()
      .from(adminEmails)
      .where(eq(adminEmails.email, email))
      .limit(1);

    return admins.length > 0;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(authenticatedUser.email);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const allAdminEmails = await db.select()
      .from(adminEmails)
      .orderBy(desc(adminEmails.createdAt));

    return NextResponse.json(allAdminEmails, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(authenticatedUser.email);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || email.trim() === '') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password || password.trim() === '') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists in admin emails
    const existingAdmins = await db.select()
      .from(adminEmails)
      .where(eq(adminEmails.email, normalizedEmail))
      .limit(1);

    if (existingAdmins.length > 0) {
      return NextResponse.json({ error: 'Email already exists as admin' }, { status: 409 });
    }

    // Check if user already exists
    const existingUsers = await db.select()
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1);

    let userId: string;

    if (existingUsers.length > 0) {
      // User exists, just add to admin emails
      userId = existingUsers[0].id;
      
      // Check if they have a credential account
      const existingAccount = await db.select()
        .from(account)
        .where(
          and(
            eq(account.userId, userId),
            eq(account.providerId, 'credential')
          )
        )
        .limit(1);

      if (existingAccount.length === 0) {
        // Create credential account with password
        const hashedPassword = await bcrypt.hash(password, 10);
        const accountId = generateId();
        const now = new Date();

        await db.insert(account).values({
          id: accountId,
          accountId: normalizedEmail,
          providerId: 'credential',
          userId: userId,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now
        });
      } else {
        // Update existing password
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.update(account)
          .set({
            password: hashedPassword,
            updatedAt: new Date()
          })
          .where(eq(account.id, existingAccount[0].id));
      }
    } else {
      // Create new user and account
      userId = generateId();
      const hashedPassword = await bcrypt.hash(password, 10);
      const now = new Date();

      // Create user
      await db.insert(user).values({
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        emailVerified: true,
        createdAt: now,
        updatedAt: now
      });

      // Create credential account
      const accountId = generateId();
      await db.insert(account).values({
        id: accountId,
        accountId: normalizedEmail,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now
      });
    }

    // Add to admin emails
    const now = new Date().toISOString();
    const newAdminEmail = await db.insert(adminEmails)
      .values({
        email: normalizedEmail,
        addedBy: authenticatedUser.email,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json({ 
      ...newAdminEmail[0],
      message: 'Admin user created successfully. They can now login with the provided credentials.'
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("request", request)
    const authenticatedUser = await authenticateRequest(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(authenticatedUser.email);
    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    if (email === authenticatedUser.email) {
      return NextResponse.json({ error: 'Cannot remove your own admin access' }, { status: 400 });
    }

    const existingAdmins = await db.select()
      .from(adminEmails)
      .where(eq(adminEmails.email, email))
      .limit(1);

    if (existingAdmins.length === 0) {
      return NextResponse.json({ error: 'Admin email not found' }, { status: 404 });
    }

    const deleted = await db.delete(adminEmails)
      .where(eq(adminEmails.email, email))
      .returning();

    return NextResponse.json({ 
      message: 'Admin email removed successfully', 
      email: deleted[0].email 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}