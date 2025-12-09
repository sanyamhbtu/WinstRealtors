import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { user, account, session } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "better-auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const normalizedEmail = email.toLowerCase().trim();
  // Find user
  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, normalizedEmail));
  if (existingUsers.length === 0) {
    return NextResponse.json(
      { error: "Invalid email or password1" },
      { status: 401 }
    );
  }

  const userId = existingUsers[0].id;

  // Find credentials account
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.userId, userId));
  if (accounts.length === 0) {
    return NextResponse.json(
      { error: "Invalid email or password2" },
      { status: 401 }
    );
  }

  const storedHash = accounts[0].password;
  if (!storedHash) {
    return NextResponse.json(
      { error: "Internal hashing error" },
      { status: 401 }
    );
  }
  
  // Compare password with bcrypt
  const isMatch = await bcrypt.compare(password, storedHash);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid email or password3" },
      { status: 401 }
    );
  }

  // Create session token manually
  const token = generateId();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days session

  await db.insert(session).values({
    id: generateId(),
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const response = NextResponse.json({ message: "Logged in successfully" });
  response.headers.set("auth-token", token);  // <-- IMPORTANT FIX

  return response;
}
