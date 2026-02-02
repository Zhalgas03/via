import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing email" },
        { status: 400 }
      )
    }

    // 1️⃣ создать пользователя в НОВОЙ таблице Users (если нет)
    const user = await prisma.users.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    // 2️⃣ выдать JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 3️⃣ записать cookie
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
    console.error("GOOGLE AUTH ERROR:", e)
    return NextResponse.json(
      { success: false, message: "Google auth failed" },
      { status: 500 }
    )
  }
}
