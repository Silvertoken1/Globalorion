import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export interface TokenPayload {
  userId: number
  email: string
  role: string
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as TokenPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Helper function to verify token from request
export async function verifyTokenFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null
  return await verifyToken(token)
}
