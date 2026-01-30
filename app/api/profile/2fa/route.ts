import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAuth } from "@/app/lib/auth"

export async function POST() {
  try {
    const auth = await requireAuth()

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { is_2fa_enabled: true },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: auth.userId },
      data: { is_2fa_enabled: !user.is_2fa_enabled },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
