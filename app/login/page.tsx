"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 ВАЖНО
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed")
        return
      }

      // ✅ уведомляем navbar / всё приложение
      window.dispatchEvent(new Event("auth-changed"))

      // редирект после логина
      router.push("/")
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ width: 360 }}>
        <h3 className="mb-4 text-center">Log In</h3>

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </button>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link href="/register">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
