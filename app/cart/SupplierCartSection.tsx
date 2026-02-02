

import prisma from "@/app/lib/prisma"
import SupplierCartSectionClient from "./SupplierCartSectionClient"

export default async function SupplierCartSection({
  cartId,
}: {
  cartId: string
})
 {
const cart = await prisma.cart.findUnique({
  where: {
    id: cartId,
  },
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


  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-sm text-zinc-500">
        Корзина этого поставщика пуста
      </div>
    )
  }

  const supplier = cart.items[0].product.supplierRel

  return (
<SupplierCartSectionClient
  cartId={cart.id}
  initialItems={cart.items}
  supplier={supplier}
/>

  )
}
