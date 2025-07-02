import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    console.log("🔄 Initializing database...")

    // Check if admin user exists
    let adminExists
    try {
      const existingAdmin = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, process.env.ADMIN_EMAIL || "admin@globalorion.com"))
        .limit(1)

      adminExists = existingAdmin.length > 0 ? existingAdmin[0] : null
    } catch (error) {
      console.log("Error checking admin user:", error)
      adminExists = null
    }

    if (!adminExists) {
      console.log("Creating admin user...")
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12)

      // Create admin user
      const [adminUser] = await db
        .insert(schema.users)
        .values({
          memberId: "GO000001",
          firstName: "Admin",
          lastName: "User",
          email: process.env.ADMIN_EMAIL || "admin@globalorion.com",
          phone: process.env.ADMIN_PHONE || "+2348000000000",
          passwordHash: hashedPassword,
          status: "active",
          role: "admin",
          activationDate: new Date(),
        })
        .returning()

      console.log("✅ Admin user created with ID:", adminUser.id)

      // Create sample PINs
      console.log("Creating sample PINs...")
      const samplePins = ["PIN123456", "PIN123457", "PIN123458", "PIN123459", "PIN123460"]

      for (const pinCode of samplePins) {
        await db.insert(schema.activationPins).values({
          pinCode,
          status: "available",
          createdBy: adminUser.id,
        })
      }

      console.log("✅ Sample PINs created")
    } else {
      console.log("✅ Admin user already exists")
    }

    // Check if system settings exist
    let settingsExist
    try {
      const existingSettings = await db.select().from(schema.systemSettings).limit(1)
      settingsExist = existingSettings.length > 0
    } catch (error) {
      console.log("Error checking system settings:", error)
      settingsExist = false
    }

    if (!settingsExist) {
      console.log("Creating system settings...")
      const settings = [
        { settingKey: "package_price", settingValue: "36000" },
        { settingKey: "min_withdrawal", settingValue: "5000" },
        { settingKey: "level_1_commission", settingValue: "4000" },
        { settingKey: "level_2_commission", settingValue: "2000" },
        { settingKey: "level_3_commission", settingValue: "2000" },
        { settingKey: "level_4_commission", settingValue: "1500" },
        { settingKey: "level_5_commission", settingValue: "1500" },
        { settingKey: "level_6_commission", settingValue: "1500" },
        { settingKey: "max_matrix_levels", settingValue: "6" },
        { settingKey: "referrals_per_level", settingValue: "5" },
        { settingKey: "company_name", settingValue: "Global Orion" },
        { settingKey: "company_email", settingValue: "info@globalorion.com" },
        { settingKey: "company_phone", settingValue: "+234-800-GLOBAL" },
      ]

      for (const setting of settings) {
        await db.insert(schema.systemSettings).values(setting)
      }

      console.log("✅ System settings created")
    } else {
      console.log("✅ System settings already exist")
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL || "admin@globalorion.com",
        password: "Check your environment variables",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)

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

export async function POST() {
  return GET()
}
