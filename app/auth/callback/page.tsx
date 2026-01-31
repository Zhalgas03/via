"use client"

import { useEffect } from "react"
import { supabase } from "@/app/lib/supabase-client"

export default function AuthCallbackPage() {
  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user?.email) {
        window.location.href = "/login"
        return
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.user.email,
          supabaseId: data.user.id,
        }),
      })

      if (!res.ok) {
        console.error("Google backend auth failed")
        window.location.href = "/login"
        return
      }

      window.dispatchEvent(new Event("auth-changed"))
      window.location.href = "/"
    }

    run()
  }, [])

  return <p style={{ textAlign: "center", marginTop: 40 }}>Signing you in…</p>
}
