import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/database"

export async function GET() {
  try {
    const result = await initializeDatabase()
    return NextResponse.json(result)
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

export async function POST() {
  return GET()
}
