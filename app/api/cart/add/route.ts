import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function POST(req: Request) {
  const { productId, quantity } = await req.json()

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    )
  }

  // 1. Получаем товар + поставщика
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      price: true,
      supplierId: true,
    },
  })

  if (!product || !product.price || !product.supplierId) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  const userId = null // позже подставишь auth

  // 2. Ищем корзину ЭТОГО поставщика
  let cart = await prisma.cart.findFirst({
    where: {
      userId,
      supplierId: product.supplierId,
    },
  })

  // 3. Если нет — создаём
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        supplierId: product.supplierId,
      },
    })
  }

  // 4. Upsert CartItem
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: product.id,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      cartId: cart.id,
      productId: product.id,
      quantity,
      price: product.price,
    },
  })

  return NextResponse.json({ success: true })
}
