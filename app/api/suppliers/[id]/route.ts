import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // 👈 ВОТ КЛЮЧ

  console.log("PUT SUPPLIER ID:", id)

  if (!id) {
    return NextResponse.json(
      { error: "Supplier id missing" },
      { status: 400 }
    )
  }

  const data = await req.json()

  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone || null,
      contactName: data.contactName || null,
    },
  })

  return NextResponse.json(supplier)
}
