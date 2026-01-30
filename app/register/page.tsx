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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role, // 👈 ВАЖНО
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push("/login")
      } else {
        setError(data.message || "Registration failed")
      }
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
      <form onSubmit={submit} style={{ width: 360 }}>
        <h3 className="mb-4 text-center">Sign Up</h3>

        {/* EMAIL */}
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* CONFIRM */}
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />

        {/* ROLE SELECT */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            I am registering as
          </label>

          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value as Role)}
          >
            <option value="BUYER">Buyer (I want to buy)</option>
            <option value="SELLER">Seller (I want to sell)</option>
          </select>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
