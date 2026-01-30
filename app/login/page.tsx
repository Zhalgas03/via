"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/app/lib/supabase-client"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    setError("Google login failed")
  }
}


  const submit = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed")
        return
      }

      window.dispatchEvent(new Event("auth-changed"))
      router.push("/")
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
          width: 380,
          background: "#1f1f1f",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
          color: "#fff",
        }}
      >
        {/* LOGO / TITLE */}
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
          <h4 style={{ marginBottom: 8, fontWeight: 600 }}>Log in to ViaMart</h4>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            Enter your email and password
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
            marginTop: 8,
          }}
        >
          {loading ? "Signing in..." : "Continue"}
        </button>

        {/* FOOTER */}
        <div style={{ textAlign: "center", fontSize: 14 }}>
          <span style={{ color: "#9ca3af" }}>
            Don’t have an account?{" "}
          </span>
          <Link
            href="/register"
            style={{ color: "#9acd32", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </div>
        {/* OR */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "16px 0",
    color: "#6b7280",
    fontSize: 13,
  }}
>
  <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
  or
  <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
</div>

{/* GOOGLE BUTTON */}
<button
  onClick={loginWithGoogle}
  style={{
    width: "100%",
    height: 44,
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    background: "#111",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  }}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    width={18}
    height={18}
  />
  Continue with Google
</button>

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
