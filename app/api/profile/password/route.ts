import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAuth } from "@/app/lib/auth"

export async function POST(req: Request) {
  try {
    const auth = await requireAuth()
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing password fields" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // 🔴 ВАЖНО
    if (!user.password) {
      return NextResponse.json(
        { message: "Password is not set for this account" },
        { status: 400 }
      )
    }

    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      )
    }

    const hash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hash },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }
}
