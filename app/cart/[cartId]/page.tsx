import SupplierCartSection from "../SupplierCartSection"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export default async function SupplierCartPage({
  params,
}: {
  params: Promise<{ cartId: string }>
}) {
  const { cartId } = await params

  return (
      <div className="py-6 space-y-6">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-zinc-400">
        <Link
          href="/cart"
          className="flex items-center gap-1 hover:text-zinc-300 transition no-underline"
          style={{ color: "#9ca3af" , textDecoration: "none" }}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Корзина</span>
        </Link>

        <span className="text-zinc-600">/</span>
        <span className="truncate">
          Детали заказа
        </span>
      </div>
      <SupplierCartSection cartId={cartId} />
    </div>
  )
}

