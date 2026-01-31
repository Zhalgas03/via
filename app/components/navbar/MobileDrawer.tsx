"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MobileDrawer({
  open,
  onClose,
  email,
}: {
  open: boolean
  onClose: () => void
  email: string
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const letter = email[0].toUpperCase()

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    window.dispatchEvent(new Event("auth-changed"))
    router.push("/login")
  }

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 1000,
          }}
        />
      )}

      {/* DRAWER */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: 280,
          background: "#0f0f0f",
          padding: 16,
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .25s ease",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ color: "#9acd32", fontWeight: 600, fontSize: 18 }}>
            ViaMart
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: 22,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {/* PROFILE FOOTER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 12,
            borderTop: "1px solid #2a2a2a",
          }}
        >
          {/* avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#4a5d1a",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/profile")
              onClose()
            }}
          >
            {letter}
          </div>

          {/* email */}
          <div
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => {
              router.push("/profile")
              onClose()
            }}
          >
            <div style={{ color: "#fff", fontSize: 14 }}>{email}</div>
          </div>

          {/* menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ⋮
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: 36,
                  right: 0,
                  background: "#1b1b1b",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  overflow: "hidden",
                  minWidth: 140,
                }}
              >
                <button
                  onClick={() => {
                    router.push("/profile")
                    onClose()
                  }}
                  style={menuItem}
                >
                  Profile
                </button>

                <button
                  onClick={logout}
                  style={{ ...menuItem, color: "#ef4444" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const menuItem: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "transparent",
  border: "none",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
}
