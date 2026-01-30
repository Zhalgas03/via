import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET!

export type AuthPayload = {
  userId: string
  role: "BUYER" | "SELLER" | "ADMIN"
}

export async function requireAuth(): Promise<AuthPayload> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    throw new Error("UNAUTHORIZED")
  }

  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    throw new Error("UNAUTHORIZED")
  }
}
