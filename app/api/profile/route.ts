import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { requireAuth } from "@/app/lib/auth"

/* ---------- GET PROFILE ---------- */
export async function GET() {
  try {
    const auth = await requireAuth()

    const user = await prisma.users.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }
}
