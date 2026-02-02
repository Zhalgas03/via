import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { send2FACode } from "@/app/lib/mailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      )
    }

    // 1️⃣ создать пользователя в НОВОЙ таблице Users (если нет)
    await prisma.users.upsert({
      where: { email },
      update: {},
      create: {
        email,
      },
    })

    // 2️⃣ сгенерировать 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 3️⃣ удалить старые коды для этого email (чисто и безопасно)
    await prisma.emailLoginCode.deleteMany({
      where: { email },
    })

    // 4️⃣ сохранить новый код
    await prisma.emailLoginCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
      },
    })

    // 5️⃣ отправить email
    await send2FACode(email, code)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("2FA REQUEST ERROR:", e)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
