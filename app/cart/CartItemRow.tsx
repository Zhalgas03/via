"use client"

import { useEffect, useRef, useState } from "react"

export default function CartItemRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: any
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  const [qty, setQty] = useState(item.quantity)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setQty(item.quantity)
  }, [item.quantity])

  function changeQty(newQty: number) {
    // ❌ если жмём "-" при 1 → УДАЛЯЕМ
    if (newQty < 1) {
      onRemove(item.id)

      fetch("/api/cart/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      })

      return
    }

    setQty(newQty)
    onQtyChange(item.id, newQty)

    // debounce PATCH
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetch("/api/cart/item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          quantity: newQty,
        }),
      })
    }, 300)
  }

  return (
    <div className="grid grid-cols-[1fr_140px_120px] items-center py-4 border-b border-zinc-800">
      {/* PRODUCT */}
      <div>
        <div className="text-sm text-zinc-100">
          {item.product.name}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          {item.price} ₸ / шт
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => changeQty(qty - 1)}
          className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
        >
          −
        </button>

        <div className="w-6 text-center text-sm text-zinc-100">
          {qty}
        </div>

        <button
          onClick={() => changeQty(qty + 1)}
          className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
        >
          +
        </button>
      </div>

      {/* SUM */}
      <div className="text-right text-sm text-zinc-100">
        {(Number(item.price) * qty).toLocaleString()} ₸
      </div>
    </div>
  )
}
