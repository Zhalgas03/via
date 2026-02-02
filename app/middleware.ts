import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPage =
    pathname.startsWith("/login")

  const token = req.cookies.get("token")?.value

  // 🔁 если уже залогинен — не пускаем на login
  if (isAuthPage && token) {
    return NextResponse.redirect(
      new URL("/", req.url)
    )
  }

  // 🔒 защищённые страницы
  const protectedPaths = [
    "/",
    "/products",
    "/suppliers",
    "/cart",
    "/profile",
  ]

  const isProtected = protectedPaths.some(
    p => pathname === p || pathname.startsWith(p + "/")
  )

  // не защищённая — пускаем
  if (!isProtected) {
    return NextResponse.next()
  }

  // защищённая, но без токена
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }

  // проверяем токен
  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/products/:path*",
    "/suppliers/:path*",
    "/cart/:path*",
    "/profile/:path*",
  ],
}
