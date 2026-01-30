import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireAuth } from "@/app/lib/auth"
import { supabase } from "@/app/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const auth = await requireAuth()
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ message: "No file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const path = `users/${auth.userId}/avatar.jpg`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, buffer, {
        upsert: true,
        contentType: file.type,
      })

    if (error) {
      return NextResponse.json({ message: "Upload failed" }, { status: 500 })
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

    await prisma.user.update({
      where: { id: auth.userId },
      data: { avatar_url: avatarUrl },
    })

    return NextResponse.json({ avatarUrl })
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
