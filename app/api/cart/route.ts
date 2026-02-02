import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function DELETE(req: Request) {
  const { cartId } = await req.json()

  if (!cartId) {
    return NextResponse.json(
      { error: "cartId missing" },
      { status: 400 }
    )
  }

  // 1. удаляем items
  await prisma.cartItem.deleteMany({
    where: { cartId },
  })

  // 2. удаляем cart
  await prisma.cart.delete({
    where: { id: cartId },
  })

  return NextResponse.json({ success: true })
}
