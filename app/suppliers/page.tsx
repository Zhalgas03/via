export const dynamic = "force-dynamic"

import prisma from "@/app/lib/prisma"
import SuppliersList from "./SuppliersList"

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="py-6">
      <SuppliersList suppliers={suppliers} />
    </div>
  )
}
