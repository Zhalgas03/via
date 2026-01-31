"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CubeIcon,
  TruckIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"

const tabs = [
  {
    href: "/products",
    label: "Товары",
    Icon: CubeIcon,
  },
  {
    href: "/suppliers",
    label: "Поставщики",
    Icon: TruckIcon,
  },
  {
    href: "/cart",
    label: "Корзина",
    Icon: ShoppingCartIcon,
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "#1b1b1b",
        borderTop: "1px solid #2a2a2a",
        display: "flex",
        zIndex: 1000,
      }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className="d-flex flex-column align-items-center justify-content-center text-decoration-none"
            style={{
              flex: 1,
              color: active ? "#9acd32" : "#9ca3af",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={1.6}
            />
            <span style={{ marginTop: 2 }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
