"use client"

import { useState } from "react"

type Props = {
  suppliers: string[]
  selectedSuppliers: string[]
  onToggleSupplier: (s: string) => void
  onClear: () => void
}

export default function SupplierFilter({
  suppliers,
  selectedSuppliers,
  onToggleSupplier,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {/* BUTTON */}
     <button
  onClick={() => setOpen((v) => !v)}
  className={`
    h-10 px-3 pe-4 rounded-lg
    flex items-center gap-2
    text-sm transition 
    ${
      open
        ? "bg-[#2e2e2e] border-[#7a9432] text-[#7a9432]"
        : "bg-[#2e2e2e] border-[#3a3a3a] text-zinc-300 hover:border-[#7a9432]"
    }
  `}
  style={{ borderRadius: "8px" }}
>
  {/* FILTER ICON */}
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6h16M7 12h10M10 18h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>

  {/* TEXT */}
  <span>Filter</span>

  {/* COUNT */}
  {selectedSuppliers.length > 0 && (
    <span className="rounded-full bg-[#7a9432] px-1.5 text-[11px] text-black">
      {selectedSuppliers.length}
    </span>
  )}

  {/* CARET */}
  <svg
    className={`ml-2 h-4 w-4 transition-transform ${
      open ? "rotate-180" : ""
    }`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>


      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 top-12
            w-60
            rounded-xl
            bg-[#2e2e2e]
            border-[#3a3a3a]
            shadow-xl
            z-50
          "
        >
          {/* Header */}
          <div className="px-3 py-3 border-b border-[#3a3a3a]">
            <div className="text-sm font-medium text-zinc-100">
              Supplier
            </div>
          </div>

          {/* List */}
          <div className="px-1 py-2 space-y-2 max-h-60 overflow-auto">
            {suppliers.map((s) => {
              const checked = selectedSuppliers.includes(s)

              return (
                <button
                  key={s}
                  onClick={() => onToggleSupplier(s)}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2 rounded-lg text-sm transition
                    ${
                      checked
                        ? "bg-[#7a9432]/20 text-[#7a9432]"
                        : "text-zinc-300 hover:bg-[#3a3a3a]"
                    }
                  `}
                >
                  {s}
                  <span
                    className={`
                      h-4 w-4 rounded border
                      ${
                        checked
                          ? "bg-[#7a9432] border-[#7a9432]"
                          : "border-[#555]"
                      }
                    `}
                  />
                </button>
              )
            })}
          </div>

         {/* Actions */}
<div className="px-3 py-3 border-t border-[#3a3a3a] flex gap-2">
<button
  onClick={onClear}
  style={{ borderRadius: "8px" }}
  className="
    flex-1 h-9
    text-sm text-zinc-300
    border border-[#444]
    hover:bg-[#3a3a3a]
  "
>
  Clear
</button>

<button
  onClick={() => setOpen(false)}
  style={{ borderRadius: "8px" }}
  className="
    flex-1 h-9
    bg-[#7a9432]
    text-sm font-medium text-black
    hover:bg-[#8faa3a]
  "
>
  Done
</button>

</div>

        </div>
      )}
    </div>
  )
}
