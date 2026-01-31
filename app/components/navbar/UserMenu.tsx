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
      credentials: "include",
    })

    window.dispatchEvent(new Event("auth-changed"))
    router.push("/login")
  }

  return (
    <div className="position-relative" ref={ref}>
      {/* AVATAR */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#4a5d1a",
          border: "none",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {letter}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 180,
            background: "#121212",
            border: "1px solid #2f2f2f", // 👈 тёмно-серый бордер
            borderRadius: 12,
            padding: 6,
            zIndex: 1000,
            boxShadow: "0 10px 30px rgba(0,0,0,.45)",
          }}
        >
          <button
            onClick={() => {
              router.push("/profile")
              setOpen(false)
            }}
            style={itemStyle}
          >
            View Profile
          </button>

          <div
            style={{
              height: 1,
              background: "#2a2a2a",
              margin: "6px 0",
            }}
          />

          <button
            onClick={logout}
            style={{
              ...itemStyle,
              color: "#f87171",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

const itemStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "transparent",
  border: "none",
  color: "#fff",
  textAlign: "left",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
}
