import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/database"

export async function GET() {
  try {
    console.log("🚀 Database initialization started...")

    const result = await initializeDatabase()

    console.log("✅ Database initialization completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      data: result,
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
