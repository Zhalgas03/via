import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(product)
}
