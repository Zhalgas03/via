"use client"


import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export default function VerifyPage() {
  const router = useRouter()
  const submittedRef = useRef(false)

  const [email, setEmail] = useState("")
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔒 берём email из предыдущего шага
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("2fa-email")
    if (!savedEmail) {
      router.push("/login")
      return
    }
    setEmail(savedEmail)
  }, [router])

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      ;(next as HTMLInputElement)?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      ;(prev as HTMLInputElement)?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault()

  const pasted = e.clipboardData
    .getData("text")
    .replace(/\D/g, "")
    .slice(0, 6)

  if (!pasted) return

  const newCode = pasted.split("")
  while (newCode.length < 6) newCode.push("")

  setCode(newCode)


  const lastIndex = Math.min(pasted.length, 6) - 1
  const last = document.getElementById(`otp-${lastIndex}`)
  ;(last as HTMLInputElement)?.focus()
}


  const submit = async () => {
    const finalCode = code.join("")

    if (finalCode.length !== 6) {
      setError("Enter the 6-digit code")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: finalCode }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid code")
        return
      }

      sessionStorage.removeItem("2fa-email")
      window.dispatchEvent(new Event("auth-changed"))
      router.push("/")
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  const finalCode = code.join("")

  if (
    finalCode.length === 6 &&
    !loading &&
    !submittedRef.current
  ) {
    submittedRef.current = true
    submit()
  }
}, [code, loading])


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
          width: 360,
          background: "#1f1f1f",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 20px 40px rgba(0,0,0,.25)",
          color: "#fff",
        }}
      >
        <h4 style={{ marginBottom: 8, fontWeight: 600, textAlign: "center" }}>
          Verify your login
        </h4>

        <p
          style={{
            color: "#9ca3af",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Enter the 6-digit code sent to<br />
          <strong>{email}</strong>
        </p>

        {/* OTP INPUT */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {code.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              onPaste={handlePaste}
              style={{
                width: 44,
                height: 52,
                borderRadius: 10,
                border: "1px solid #2a2a2a",
                background: "#2a2a2a",
                color: "#fff",
                textAlign: "center",
                fontSize: 20,
                fontWeight: 600,
                outline: "none",
              }}
            />
          ))}
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
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

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
            marginTop: 8,
          }}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  )
}
