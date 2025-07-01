import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./db/schema"

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(client, { schema })

export function getDatabase() {
  return db
}

export async function testConnection() {
  try {
    await db.select().from(schema.users).limit(1)
    console.log("✅ Database connected successfully!")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

export interface Pin {
  id: number
  pinCode: string
  status: "available" | "used" | "expired"
  createdBy: number
  usedBy?: number
  createdAt: Date
  usedAt?: Date
}

export async function createPin(pinCode: string, createdBy: number): Promise<Pin> {
  const [row] = await db
    .insert(schema.activationPins)
    .values({
      pinCode,
      status: "available",
      createdBy,
    })
    .returning()

  return {
    id: row.id,
    pinCode: row.pinCode,
    status: row.status as "available" | "used" | "expired",
    createdBy: row.createdBy!,
    usedBy: row.usedBy ?? undefined,
    createdAt: row.createdAt!,
    usedAt: row.usedAt ?? undefined,
  }
}
