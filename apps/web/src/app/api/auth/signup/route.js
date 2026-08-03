// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { prismaUser } from "@/lib/prisma/user";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password, username } = body;

  // 1) Basic validation
  if (!name?.trim() || !email?.trim() || !password || !username?.trim()) {
    return NextResponse.json(
      { error: "All fields (name, email, username, password) are required." },
      { status: 400 }
    );
  }

  // 2) Normalize inputs
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  try {
    const result = await prismaUser.$transaction(async (tx) => {
      // 3) Check for existing email
      const existingEmail = await tx.users.findUnique({
        where: { email: normalizedEmail },
      });
      if (existingEmail) {
        throw new Error("EMAIL_EXISTS");
      }

      // 4) Check for existing username
      const existingUsername = await tx.user_profile.findUnique({
        where: { username: normalizedUsername },
      });
      if (existingUsername) {
        throw new Error("USERNAME_EXISTS");
      }

      // 5) Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // 6) Create `users` row
      const user = await tx.users.create({
        data: {
          id: uuidv4(),
          email: normalizedEmail,
          password_hash,
          is_verified: false,
        },
      });

      // 7) Create `user_profile` row
      const profile = await tx.user_profile.create({
        data: {
          user_id: user.id,
          display_name: name.trim(),
          username: normalizedUsername,
          avatar_url:
            "https://canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
          banner_url:
            "https://www.mcentre.lk/frontend/assets/images/default-banner.png",
        },
      });

      return { user, profile };
    });

    // 8) Successful response
    return NextResponse.json(
      {
        message: "Signed up successfully",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.profile.display_name,
          username: result.profile.username,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    // 9) Granular error handling
    if (err instanceof Error) {
      if (err.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          { error: "Email is already registered." },
          { status: 409 }
        );
      }
      if (err.message === "USERNAME_EXISTS") {
        return NextResponse.json(
          { error: "Username is already taken." },
          { status: 409 }
        );
      }
    }

    console.error("Sign-up error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
