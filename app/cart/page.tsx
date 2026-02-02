export const dynamic = "force-dynamic"

import prisma from "@/app/lib/prisma"
import Link from "next/link"

export default async function CartPage() {
  const carts = await prisma.cart.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              supplierRel: true,
            },
          },
        },
      },
    },
  })

  if (carts.length === 0) {
    return <div className="py-6 text-zinc-500">Корзина пуста</div>
  }

  return (
    <div className="py-6 space-y-8">
      <p className="text-[28px] font-semibold text-zinc-100 mb-4">
        Детали заказа
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {carts.map(cart => {
          if (cart.items.length === 0) return null

          const supplier = cart.items[0].product.supplierRel
          if (!supplier) return null

          const total = cart.items.reduce(
            (sum, i) => sum + Number(i.price) * i.quantity,
            0
          )

          return (
            <Link
              key={cart.id}
              href={`/cart/${cart.id}`}
              className="block no-underline"
            >
              <div className="space-y-2">
                <div className="w-full h-[180px] rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 transition" />
                <div>
                  <div className="text-sm font-medium text-zinc-100">
                    {supplier.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {total.toLocaleString()} ₸
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
