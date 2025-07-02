import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, activationPins } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if admin user already exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@globalorion.com"
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1)

    if (existingAdmin.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already initialized",
        admin: {
          email: existingAdmin[0].email,
          memberId: existingAdmin[0].memberId,
        },
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12)

    const [adminUser] = await db
      .insert(users)
      .values({
        memberId: "GO000001",
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || "+2348000000000",
        passwordHash: hashedPassword,
        status: "active",
        role: "admin",
        activationDate: new Date(),
      })
      .returning()

    // Create sample PINs
    const samplePins = ["PIN123456", "PIN123457", "PIN123458", "PIN123459", "PIN123460"]

    for (const pinCode of samplePins) {
      await db.insert(activationPins).values({
        pin: pinCode,
        status: "available",
        createdBy: adminUser.id,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      admin: {
        email: adminUser.email,
        memberId: adminUser.memberId,
      },
      pinsCreated: samplePins.length,
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
