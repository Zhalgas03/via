import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json(
      { success: false, message: "Missing data" },
      { status: 400 }
    )
  }

  const record = await prisma.email2FACode.findUnique({
    where: { email },
  })

  if (!record) {
    return NextResponse.json(
      { success: false, message: "No verification code found" },
      { status: 404 }
    )
  }

  if (record.expires_at < new Date()) {
    return NextResponse.json(
      { success: false, message: "Code expired" },
      { status: 400 }
    )
  }

  if (record.code !== code) {
    return NextResponse.json(
      { success: false, message: "Invalid code" },
      { status: 401 }
    )
  }

  await prisma.email2FACode.delete({
    where: { email },
  })

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    )
  }

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
}
