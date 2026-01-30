import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"

type Role = "BUYER" | "SELLER"

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      )
    }

    // ✅ ЖЁСТКАЯ ВАЛИДАЦИЯ РОЛИ
    const safeRole: Role =
      role === "SELLER" ? "SELLER" : "BUYER"

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name ?? null,
        role: safeRole, // ✅ ТЕПЕРЬ НЕ ХАРДКОД
      },
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("REGISTER ERROR:", e)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
