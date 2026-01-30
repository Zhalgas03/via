import { redirect } from "next/navigation"
import { requireAuth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export default async function ProfilePage() {
  let auth

  try {
    auth = await requireAuth()
  } catch {
    redirect("/login") // ✅ ВАЖНО
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Profile</h1>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </div>
  )
}
