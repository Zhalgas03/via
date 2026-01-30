import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAuth } from "@/app/lib/auth"
import { mapUser } from "@/app/lib/mappers/user"

/* ---------- GET PROFILE ---------- */
export async function GET() {
  try {
    const auth = await requireAuth()

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(mapUser(user))
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }
}

/* ---------- UPDATE PROFILE ---------- */
export async function PUT(req: Request) {
  try {
    const auth = await requireAuth()
    const { name } = await req.json()

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: { name },
    })

    return NextResponse.json(mapUser(user))
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }
}
