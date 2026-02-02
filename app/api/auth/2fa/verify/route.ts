import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      )
    }

    // 1️⃣ найти код (по composite key)
    const record = await prisma.emailLoginCode.findUnique({
      where: {
        email_code: {
          email,
          code,
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 401 }
      )
    }

    // 2️⃣ проверить срок действия
    if (record.expiresAt < new Date()) {
      // удаляем протухший код
      await prisma.emailLoginCode.delete({
        where: {
          email_code: {
            email,
            code,
          },
        },
      })

      return NextResponse.json(
        { success: false, message: "Code expired" },
        { status: 400 }
      )
    }

    // 3️⃣ удалить ВСЕ коды этого email (одноразовый логин)
    await prisma.emailLoginCode.deleteMany({
      where: { email },
    })

    // 4️⃣ найти пользователя
    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    // 5️⃣ выдать JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const res = NextResponse.json({ success: true })

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (e) {
    console.error("2FA VERIFY ERROR:", e)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
