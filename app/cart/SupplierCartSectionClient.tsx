"use client"

import { useMemo, useState } from "react"
import CartItemRow from "./CartItemRow"

function buildWhatsappLink(items: any[], phone?: string) {
  const text = items
    .map(
      i =>
        `${i.product.name} — ${i.quantity} шт (${(
          Number(i.price) * i.quantity
        ).toLocaleString()} ₸)`
    )
    .join("\n")

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  )

  return `https://api.whatsapp.com/send?phone=${phone ?? ""}&text=${encodeURIComponent(
    `${text}\n\nИтого: ${total.toLocaleString()} ₸`
  )}`
}

export default function SupplierCartClient({
  cartId,
  initialItems,
  supplier,
}: {
  cartId: string
  initialItems: any[]
  supplier: any
}) {

  const [items, setItems] = useState(initialItems)

  function handleQtyChange(itemId: string, qty: number) {
    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, quantity: qty } : i
      )
    )
  }

  function handleRemove(itemId: string) {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  async function deleteOrder() {
  await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId }),
  })

  setItems([])
}

  const total = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + Number(i.price) * i.quantity,
        0
      ),
    [items]
  )

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-zinc-100">
            Заказ у {supplier.name}
          </div>
          {supplier.phone && (
            <div className="text-sm text-zinc-400 mt-1">
              Телефон: {supplier.phone}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-400">
            Сумма заказа
          </div>
          <div className="text-xl font-bold text-zinc-100">
            {total.toLocaleString()} ₸
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_120px] py-2 text-xs text-zinc-500 border-b border-zinc-800">
          <div>Товар</div>
          <div className="text-center">Кол-во</div>
          <div className="text-right">Сумма</div>
        </div>

        <div className="divide-y divide-zinc-800">
          {items.map(item => (
            <CartItemRow
              key={item.id}
              item={item}
              onQtyChange={handleQtyChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>

{/* ACTIONS */}

  <div className="flex gap-3 justify-end">
        {/* SECONDARY — Delete */}
    <button
      onClick={deleteOrder}
      className="
        h-10 px-3
        text-zinc-300
        bg-transparent
        hover:bg-[#2e2e2e]
        hover:border-[#6b7280]
        transition
      "
      style={{
        borderRadius: "8px",
        fontSize: "15px",
        border: "1px solid #ffffff",
      }}
    >
      Удалить заказ
    </button>
    {/* PRIMARY — WhatsApp */}
    {supplier.phone && items.length > 0 && (
      <a
        href={buildWhatsappLink(items, supplier.phone)}
        target="_blank"
        className="
          h-10 px-4
          text-sm
          rounded-lg
          bg-[#7a9432]
          text-zinc-300
          transition
          flex items-center
          hover:opacity-90
        "
        style={{ borderRadius: "8px", fontSize: "15px" , textDecoration: "none", color: "inherit"}}
      >
        Заказать
      </a>
    )}


  </div>
</div>

  )
}
