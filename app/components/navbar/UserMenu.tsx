"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const letter = email[0].toUpperCase()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // 👈 важно
    })

    // сообщаем всему приложению
    window.dispatchEvent(new Event("auth-changed"))

    router.push("/login")
  }

  return (
    <div className="position-relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-circle border-0 fw-semibold text-white"
        style={{
          width: 32,
          height: 32,
          backgroundColor: "#4a5d1a",
        }}
      >
        {letter}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 rounded shadow"
          style={{
            width: 160,
            backgroundColor: "#1b1b1b",
            border: "1px solid #2a2a2a",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => router.push("/profile")}
            className="dropdown-item text-white"
          >
            Profile
          </button>

          <div className="dropdown-divider bg-secondary" />

          <button
            onClick={logout}
            className="dropdown-item text-danger"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
