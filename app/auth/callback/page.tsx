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

      // 🔥 ВАЖНО: redirect, а не fetch
      window.location.href =
        `/api/auth/google?email=${encodeURIComponent(
          data.user.email
        )}&supabaseId=${data.user.id}`
    }

    run()
  }, [])

  return <p style={{ textAlign: "center", marginTop: 40 }}>Signing you in…</p>
}
