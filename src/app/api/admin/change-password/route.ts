import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account, session } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function PUT(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Unauthorized - No valid token provided',
          code: 'NO_TOKEN'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Query session table to validate token and check expiration
    const currentTime = new Date();
    const validSession = await db.select()
      .from(session)
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, currentTime)
        )
      )
      .limit(1);

    if (validSession.length === 0) {
      return NextResponse.json(
        { 
          error: 'Unauthorized - Invalid or expired session',
          code: 'INVALID_SESSION'
        },
        { status: 401 }
      );
    }

    const userId = validSession[0].userId;

    // Get user record
    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Current password is required',
          code: 'MISSING_CURRENT_PASSWORD'
        },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim() === '') {
      return NextResponse.json(
        { 
          error: 'New password is required',
          code: 'MISSING_NEW_PASSWORD'
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          error: 'New password must be at least 8 characters long',
          code: 'PASSWORD_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    // Query account table for credential-based account
    const credentialAccount = await db.select()
      .from(account)
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, 'credential')
        )
      )
      .limit(1);

    if (credentialAccount.length === 0) {
      return NextResponse.json(
        { 
          error: 'No password set for this account',
          code: 'NO_PASSWORD_ACCOUNT'
        },
        { status: 400 }
      );
    }

    const userAccount = credentialAccount[0];

    if (!userAccount.password) {
      return NextResponse.json(
        { 
          error: 'No password set for this account',
          code: 'NO_PASSWORD_SET'
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userAccount.password);
    console.log("currentPassword", currentPassword);
    console.log("userPassword", userAccount.password);
    console.log("isPassword", isPasswordValid);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update account with new password
    await db.update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(account.id, userAccount.id));

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT /api/change-password error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}