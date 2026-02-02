import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function PATCH(req: Request) {
  const { itemId, quantity } = await req.json()

  if (!itemId || typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    )
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  })

  return NextResponse.json({ success: true })
}
export async function DELETE(req: Request) {
  const { itemId } = await req.json()

  if (!itemId) {
    return NextResponse.json(
      { error: "itemId missing" },
      { status: 400 }
    )
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  })

  return NextResponse.json({ success: true })
}
