import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const email = searchParams.get("email")
  const supabaseId = searchParams.get("supabaseId")

  if (!email || !supabaseId) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { supabaseId },
    create: {
      email,
      supabaseId,
      role: "BUYER",
    },
  })

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  // 🔥 COOKIE СТАВИТСЯ ЗДЕСЬ
  const res = NextResponse.redirect(new URL("/", req.url))

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  return res
}
