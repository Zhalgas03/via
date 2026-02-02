import prisma from "@/app/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import SupplierCartSection from "@/app/cart/SupplierCartSection"
type SupplierPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  const { id } = await params

  if (!id) notFound()

  const supplier = await prisma.supplier.findUnique({
    where: { id },
  })

  if (!supplier) notFound()

  return (
    <div className="py-6 space-y-6">
      {/* BREADCRUMB / BACK */}
      <div className="flex items-center gap-2 text-[13px] text-zinc-400">
        <Link
          href="/suppliers"
          className="flex items-center gap-1 hover:text-zinc-300 transition"
          style={{ color: "#9ca3af", textDecoration: "none" }}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Поставщики</span>
        </Link>

        <span className="text-zinc-600">/</span>
        <span className="truncate">{supplier.name}</span>
      </div>

      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-zinc-100">
        {supplier.name}
      </h1>

      {/* DETAILS */}
      <div className="space-y-1 text-sm text-zinc-400">
        <div>
          <span className="text-zinc-500">Телефон:</span>{" "}
          {supplier.phone ?? "—"}
        </div>

        {supplier.contactName && (
          <div>
            <span className="text-zinc-500">Контакт:</span>{" "}
            {supplier.contactName}
          </div>
        )}
        
      </div>
    </div>
  )
}
