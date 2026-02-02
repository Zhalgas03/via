"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Pagination from "./Pagination"

const PAGE_SIZE = 10
const IMAGE_SIZE = 50

export default function SupplierSection({
  supplier,
  products,
}: {
  supplier: string
  products: any[]
}) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const current = products.slice(start, start + PAGE_SIZE)

  return (
    <section>
      {/* supplier title */}
     <div className="flex items-center justify-between">
      <p className="text-[20px] font-bold text-zinc-300">
        {supplier}
      </p>

        <span className="text-xs text-zinc-500">
          {products.length} позиций
        </span>
      </div>



      {/* products */}
      <div className="divide-y divide-zinc-800">
        {current.map((p) => (
<Link
  key={p.id}
  href={`/products/${p.id}`}
  className="block"
  style={{ textDecoration: "none" }}
>
            <div
              className="
                grid grid-cols-[1fr_120px]
                items-center
                px-1 py-3
                hover:bg-zinc-800/30
                transition
              "
            >
              {/* LEFT */}
             <div className="flex items-center gap-3 min-w-0">
  {p.imageUrl ? (
    <div
      className="relative bg-zinc-800 rounded overflow-hidden shrink-0"
      style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
    >
      <Image
        src={p.imageUrl}
        alt={p.name}
        fill
        className="object-cover object-center"
      />
    </div>
  ) : (
    <div
      className="bg-zinc-700 rounded shrink-0"
      style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
    />
  )}

  <div className="min-w-0">
    <div className="text-[15px] text-zinc-100 truncate">
      {p.name}
    </div>
    <div className="mt-0.5 text-[13px] text-zinc-500">
      {p.volumeLiters ?? "—"}
      {p.category && (
        <>
          <span className="mx-1">·</span>
          {p.category}
        </>
      )}
    </div>
  </div>
</div>


              {/* PRICE */}
              <div className="text-[15px] font-medium text-right text-zinc-100">
                {p.price} ₸
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </section>
  )
}
