import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: "Missing email" },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
      },
      create: {
        email,
        name,
        role: "BUYER",
      },
    })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    const res = NextResponse.json({ success: true })

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: "Google auth failed" },
      { status: 500 }
    )
  }
}
