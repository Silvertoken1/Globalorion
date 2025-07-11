import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./db/schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })

export async function getDatabase() {
  return db
}

export async function createPin(pin: string, createdBy?: number) {
  return await db
    .insert(schema.activationPins)
    .values({
      pin,
      createdBy,
      status: "unused",
    })
    .returning()
}

export { schema }
