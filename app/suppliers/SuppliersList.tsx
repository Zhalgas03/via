"use client"

import Link from "next/link"
import { useState } from "react"
import AddSupplierModal from "./AddSupplierModal"
import SuppliersSearch from "./SuppliersSearch"
import SupplierActions from "./SupplierActions"
import EditSupplierModal from "./EditSupplierModal"

export default function SuppliersList({ suppliers }: any) {
  const [query, setQuery] = useState("")
  const [editSupplier, setEditSupplier] = useState<any | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const filtered = suppliers.filter((s: any) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[28px] font-semibold leading-tight text-zinc-100">
          Поставщики
        </p>

        <div className="flex items-center gap-3">
          <SuppliersSearch
            query={query}
            onQueryChange={setQuery}
          />
          <AddSupplierModal />
        </div>
      </div>

     {/* LIST */}
<div className="divide-y divide-zinc-800">
  {filtered.map((s: any) => (
    <Link
      key={s.id}
      href={`/suppliers/${s.id}`}
      className="block"
      style={{ textDecoration: "none" }}
    >
      <div
        className="
          flex items-center justify-between
           py-3
          rounded-md
          hover:bg-zinc-800/30
          transition
          cursor-pointer
        "
      >
        {/* LEFT */}
        <div className="min-w-0">
          <div className="text-[15px] text-zinc-100 truncate">
            {s.name}
          </div>
          <div className="mt-0.5 text-[13px] text-zinc-500">
            Поставщик
          </div>
        </div>

        {/* RIGHT */}
        <SupplierActions
          onEdit={() => {
            setEditSupplier(s)
            setEditOpen(true)
          }}
        />
      </div>
    </Link>
  ))}

  {filtered.length === 0 && (
    <div className="py-8 text-sm text-zinc-500 text-center">
      Ничего не найдено
    </div>
  )}
</div>


      {/* EDIT MODAL — ВСЕГДА В DOM */}
      <EditSupplierModal
        supplier={editSupplier}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)

          // ❗ ждём анимацию закрытия
          setTimeout(() => {
            setEditSupplier(null)
          }, 300)
        }}
      />
    </div>
  )
}
