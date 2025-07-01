import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { users, commissions } from "@/lib/database"
import { eq, and, sum } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("👤 Profile request started...")

    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("✅ Token verified for user:", decoded.userId)

    // Get user profile
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user statistics
    const totalEarnings = await db
      .select({ total: sum(commissions.amount) })
      .from(commissions)
      .where(and(eq(commissions.userId, user.id), eq(commissions.status, "approved")))

    const pendingEarnings = await db
      .select({ total: sum(commissions.amount) })
      .from(commissions)
      .where(and(eq(commissions.userId, user.id), eq(commissions.status, "pending")))

    // Get referrals count
    const referralsCount = await db.select().from(users).where(eq(users.sponsorId, user.id))

    console.log("✅ Profile data retrieved for user:", user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        memberId: user.memberId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        activationDate: user.activationDate,
      },
      stats: {
        totalEarnings: totalEarnings[0]?.total || 0,
        pendingEarnings: pendingEarnings[0]?.total || 0,
        availableBalance: (totalEarnings[0]?.total || 0) - 0, // minus withdrawals
        referralsCount: referralsCount.length,
      },
    })
  } catch (error) {
    console.error("❌ Profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
