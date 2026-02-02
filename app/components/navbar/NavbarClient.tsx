"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import UserMenu from "./UserMenu"
import BottomNav from "./BottomNav"
import MobileDrawer from "./MobileDrawer"
import { useIsMobile } from "@/app/hooks/useIsMobile"
import {
  CubeIcon,
  TruckIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
type User = {
  email: string
}

export default function NavbarClient() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)


  const isActive = (base: string) =>
  pathname === base || pathname.startsWith(base + "/")

  
  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
          cache: "no-store",
        })

        if (!mounted) return
        setUser(res.ok ? await res.json() : null)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadUser()
    window.addEventListener("auth-changed", loadUser)

    return () => {
      mounted = false
      window.removeEventListener("auth-changed", loadUser)
    }
  }, [])

  return (
    <>
      {/* ===== MOBILE ===== */}
      {isMobile === true && (
        <>
          {/* TOP BAR */}
          <nav
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              background: "#7a9432",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn btn-sm text-white"
            >
              ☰
            </button>

            <span
              style={{
                marginLeft: 12,
                color: "#fff",
                fontWeight: 600,
              }}
            >
         
            </span>
          </nav>

          {!loading && user && (
            <MobileDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              email={user.email}
            />
          )}

          <BottomNav />
        </>
      )}

      {/* ===== DESKTOP ===== */}
      {isMobile === false && (
  <nav
    className="navbar navbar-dark"
    style={{
      backgroundColor: "#7a9432",
      height: 56,
      position: "sticky",
      top: 0,
      zIndex: 1000,
    }}
  >
    {/* ⬇️ ВОТ СЮДА КЛАСС */}
<div className="navbar-inner d-flex align-items-center position-relative">
  {/* LEFT */}
<Link
  href="/products"
  className="text-white fw-semibold text-[16px] text-decoration-none"
>
  ViaMart
</Link>



  {/* CENTER */}
  
  <div className="d-flex align-items-center gap-1 position-absolute top-50 start-50 translate-middle">
  <Link
    href="/products"
    className={`
      d-flex align-items-center gap-2 px-3 py-1.5 rounded-lg
      text-white text-decoration-none
      ${isActive("/products") ? "bg-[#6f8f2e]" : ""}
    `}
  >
    <CubeIcon className="w-4.5 h-4.5" strokeWidth={1.5} />
    <span className="text-[14px] font-semibold">Товары</span>
  </Link>

  <Link
    href="/suppliers"
    className={`
      d-flex align-items-center gap-2 px-3 py-1.5 rounded-lg
      text-white text-decoration-none
      ${isActive("/suppliers") ? "bg-[#6f8f2e]" : ""}
    `}
  >
    <TruckIcon className="w-4.5 h-4.5" strokeWidth={1.5} />
    <span className="text-[14px] font-semibold">Поставщики</span>
  </Link>

  <Link
    href="/cart"
    className={`
      d-flex align-items-center gap-2 px-3 py-1.5 rounded-lg
      text-white text-decoration-none
      ${isActive("/cart") ? "bg-[#6f8f2e]" : ""}
    `}
  >
    <ShoppingCartIcon className="w-4.5 h-4.5" strokeWidth={1.5} />
    <span className="text-[14px] font-semibold">Корзина</span>
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
</div>

  </nav>
)}

    </>
  )
}
