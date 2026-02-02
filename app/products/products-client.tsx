"use client"

import { useMemo, useState } from "react"
import SupplierSection from "./supplier-section"
import ProductsSearch from "./products-toolbar"
import SupplierFilter from "./SupplierFilter"

type Product = {
  id: string
  name: string
  supplier?: string
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])

  const suppliers = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.supplier || "Без поставщика"))
      ),
    [products]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name
        .toLowerCase()
        .includes(query.toLowerCase())

      const matchSupplier =
        selectedSuppliers.length === 0 ||
        selectedSuppliers.includes(p.supplier || "Без поставщика")

      return matchQuery && matchSupplier
    })
  }, [products, query, selectedSuppliers])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, p) => {
      const s = p.supplier || "Без поставщика"
      acc[s] ||= []
      acc[s].push(p)
      return acc
    }, {} as Record<string, Product[]>)
  }, [filtered])

  return (
    <div className="py-6 space-y-8 w-full">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-4">
<p
  className="text-[28px] font-semibold leading-tight text-zinc-100" 
>
  Товары
</p>


        <div className="flex items-center gap-2">
          <ProductsSearch
            query={query}
            onQueryChange={setQuery}
          />

          <SupplierFilter
            suppliers={suppliers}
            selectedSuppliers={selectedSuppliers}
            onToggleSupplier={(s) =>
              setSelectedSuppliers((prev) =>
                prev.includes(s)
                  ? prev.filter((x) => x !== s)
                  : [...prev, s]
              )
            }
            onClear={() => setSelectedSuppliers([])}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-12">
        {Object.entries(grouped).map(([supplier, items]) => (
          <SupplierSection
            key={supplier}
            supplier={supplier}
            products={items}
          />
        ))}
      </div>
    </div>
  )
}
