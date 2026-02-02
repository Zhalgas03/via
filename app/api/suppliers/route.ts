import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  const supplier = await prisma.supplier.create({
    data,
  })

  return NextResponse.json(supplier)
}
