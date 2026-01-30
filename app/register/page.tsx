"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Role = "BUYER" | "SELLER"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [role, setRole] = useState<Role>("BUYER")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed")
        return
      }

      router.push("/login")
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#7a9432",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 400,
          background: "#1f1f1f",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
          color: "#fff",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#9acd32",
              margin: "0 auto 16px",
            }}
          />
           <h4 style={{ marginBottom: 8, fontWeight: 600 }}>
            Create your ViaMart account
          </h4>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            Join the marketplace in seconds
          </p>
        </div>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* CONFIRM */}
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={inputStyle}
        />

        {/* ROLE */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 13,
              color: "#9ca3af",
              marginBottom: 6,
              marginTop: 8,
              display: "block",
            }}
          >
            I am registering as
          </label>

          <select
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            style={{
              ...inputStyle,
              cursor: "pointer",
            }}
          >
            <option value="BUYER">Buyer (I want to buy)</option>
            <option value="SELLER">Seller (I want to sell)</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              background: "#7f1d1d",
              color: "#fecaca",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            border: "none",
            background: "#556b2f",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 16,
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {/* FOOTER */}
        <div style={{ textAlign: "center", fontSize: 14 }}>
          <span style={{ color: "#9ca3af" }}>
            Already have an account?{" "}
          </span>
          <Link
            href="/login"
            style={{ color: "#9acd32", textDecoration: "none" }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 10,
  border: "1px solid #2a2a2a",
  background: "#2a2a2a",
  color: "#fff",
  padding: "0 12px",
  marginBottom: 12,
  outline: "none",
}
