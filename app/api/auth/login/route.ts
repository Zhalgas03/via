import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"
import { send2FACode } from "@/app/lib/mailer"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing credentials" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // 🔐 ПАРОЛЬ ВЕРНЫЙ → ЗАПУСКАЕМ 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    await prisma.email2FACode.upsert({
      where: { email },
      update: {
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    await send2FACode(email, code)

    // ❗ JWT ЗДЕСЬ НИКОГДА НЕ ВЫДАЁМ
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("LOGIN ERROR:", e)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
