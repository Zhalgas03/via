import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

type JwtPayload = {
  userId: number
  role: "BUYER" | "SELLER" | "ADMIN"
}

/**
 * Какие роли имеют доступ к каким страницам
 */
const accessMap: {
  path: string
  roles: JwtPayload["role"][]
}[] = [
  { path: "/", roles: ["BUYER", "SELLER", "ADMIN"] },
  { path: "/products", roles: ["BUYER", "SELLER", "ADMIN"] },
  { path: "/cart", roles: ["BUYER"] },
  { path: "/suppliers", roles: ["SELLER", "ADMIN"] },
  { path: "/profile", roles: ["BUYER", "SELLER", "ADMIN"] },
  { path: "/admin", roles: ["ADMIN"] },
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  const token = req.cookies.get("token")?.value

  // 🔁 авторизован → не пускаем на login/register
  if (isAuthPage && token) {
    return NextResponse.redirect(
      new URL("/", req.url)
    )
  }

  const rule = accessMap.find(r =>
    pathname === r.path || pathname.startsWith(r.path + "/")
  )

  // не защищённая страница
  if (!rule) {
    return NextResponse.next()
  }

  // защищённая, но без токена
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }

  try {
    const payload = jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload

    if (!rule.roles.includes(payload.role)) {
      // нет прав
      return NextResponse.redirect(
        new URL("/", req.url)
      )
    }

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
    "/register",
    "/products/:path*",
    "/suppliers/:path*",
    "/cart/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
}
