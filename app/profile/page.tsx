import { redirect } from "next/navigation"
import { requireAuth } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma"

export default async function ProfilePage() {
  let auth

  try {
    auth = await requireAuth()
  } catch {
    redirect("/login")
  }

  const user = await prisma.users.findUnique({
    where: { id: auth.userId },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div style={{ padding: "40px 0" }}>
      <h1>Profile</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Joined:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}
