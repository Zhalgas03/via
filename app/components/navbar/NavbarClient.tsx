"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import UserMenu from "./UserMenu"

type User = {
  email: string
}

export default function NavbarClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
          cache: "no-store",
        })

        if (!mounted) return

        if (res.ok) {
          setUser(await res.json())
        } else {
          setUser(null)
        }
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadUser()

    const onAuthChange = () => {
      setLoading(true)
      loadUser()
    }

    window.addEventListener("auth-changed", onAuthChange)

    return () => {
      mounted = false
      window.removeEventListener("auth-changed", onAuthChange)
    }
  }, [])

  return (
    <nav
      className="navbar navbar-dark px-4"
      style={{ backgroundColor: "#7a9432", height: 56 }}
    >
      {/* LEFT */}
      <div className="d-flex align-items-center gap-4">
        <Link href="/" className="navbar-brand fw-semibold text-white">
          ViaMart
        </Link>

        <Link href="/products" className="text-white text-decoration-none">
          Товары
        </Link>

        <Link href="/suppliers" className="text-white text-decoration-none">
          Поставщики
        </Link>

        <Link href="/cart" className="text-white text-decoration-none">
          Корзина
        </Link>
      </div>

      {/* RIGHT */}
      <div className="ms-auto">
        {!loading && user && <UserMenu email={user.email} />}
        {!loading && !user && (
          <Link href="/login" className="text-white text-decoration-none">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
