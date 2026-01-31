import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { send2FACode } from "@/app/lib/mailer"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email required" },
      { status: 400 }
    )
  }

  // 1️⃣ найти или создать пользователя
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      role: "BUYER",
    },
  })

  // 2️⃣ сгенерировать код
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // 3️⃣ сохранить / перезаписать код
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

  // 4️⃣ отправить email
  await send2FACode(email, code)

  return NextResponse.json({ success: true })
}
