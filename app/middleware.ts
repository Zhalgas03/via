import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  const isLogin = pathname.startsWith("/login")

  // 🔁 если залогинен — не пускаем на login
  if (isLogin && token) {
    return NextResponse.redirect(
      new URL("/products", req.url)
    )
  }

  // 🔒 защищённые страницы
  const protectedPaths = [
    "/products",
    "/suppliers",
    "/cart",
    "/profile",
  ]

  const isProtected = protectedPaths.some(
    p => pathname === p || pathname.startsWith(p + "/")
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }
}

export const config = {
  matcher: [
    "/login",
    "/products/:path*",
    "/suppliers/:path*",
    "/cart/:path*",
    "/profile/:path*",
  ],
}
