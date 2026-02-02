"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/app/lib/supabase-client"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) setError("Google login failed")
  }

  const submit = async () => {
    if (!email) {
      setError("Enter your email")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/2fa/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed")
        return
      }

      sessionStorage.setItem("2fa-email", email)
      router.push("/verify")
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={logoStyle} />
          <h4 style={{ marginBottom: 8, fontWeight: 600 }}>
            Log in to ViaMart
          </h4>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            Enter your email to continue
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

        {error && <ErrorBox text={error} />}

        <button onClick={submit} disabled={loading} style={buttonStyle}>
          {loading ? "Sending code..." : "Continue"}
        </button>

        {/* OR */}
        <Divider />

        {/* GOOGLE */}
        <button onClick={loginWithGoogle} style={googleBtn}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width={18}
          />
          Continue with Google
        </button>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "#7a9432",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}


const cardStyle: React.CSSProperties = {
  width: 380,
  background: "#1f1f1f",
  borderRadius: 20,
  padding: "32px 28px",
  boxShadow: "0 20px 40px rgba(0,0,0,.25)",
  color: "#fff",
}

const logoStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  background: "#9acd32",
  margin: "0 auto 16px",
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

const buttonStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 10,
  border: "none",
  background: "#556b2f",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  marginBottom: 16,
  marginTop: 8,
}

const googleBtn: React.CSSProperties = {
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
}

function Divider() {
  return (
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
  )
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#7f1d1d",
        color: "#fecaca",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  )
}
