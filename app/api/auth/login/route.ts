import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { users } from "@/lib/database"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Login attempt started...")

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("👤 Looking for user:", email)

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ User found:", user.email)

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ Password verified for user:", email)

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    console.log("✅ JWT token generated for user:", email)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        memberId: user.memberId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("🎉 Login successful for user:", email)
    return response
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
