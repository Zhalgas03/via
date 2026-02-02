"use client"

import { useState } from "react"

export default function AddToCartButton({
  productId,
}: {
  productId: string
}) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  async function addToCart() {
    setLoading(true)

    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    })

    setLoading(false)
    alert("Добавлено в корзину")
  }

  return (
    <div className="flex items-center gap-3">
      {/* COUNTER */}
      <div className="flex items-center h-11 rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="w-10 h-full text-zinc-400 hover:bg-neutral-700 transition"
        >
          –
        </button>

        <div className="w-12 text-center text-sm text-zinc-100">
          {quantity}
        </div>

        <button
          onClick={() => setQuantity(q => q + 1)}
          className="w-10 h-full text-zinc-400 hover:bg-neutral-700 transition"
        >
          +
        </button>
      </div>

      {/* ADD TO CART */}
      <button
        onClick={addToCart}
        disabled={loading}
        className="
          h-11 px-6
          rounded-lg
          bg-green-600 hover:bg-green-500
          text-sm font-medium text-white
          transition
          disabled:opacity-50
        "
      >
        {loading ? "Добавление…" : "В корзину"}
      </button>
    </div>
  )
}
