"use client"

import { useEffect, useRef, useState } from "react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"

type Props = {
  onEdit: () => void
}

export default function SupplierActions({ onEdit }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // закрытие по клику вне
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
     <button
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(v => !v)
  }}
  className="
    h-8 w-8
    flex items-center justify-center
    rounded-md
    text-zinc-500
    hover:bg-zinc-800/50
    hover:text-zinc-300
    transition
  "
>

        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            min-w-[120px]
            rounded-lg
            bg-[#1f1f1f]
            border border-zinc-800
            shadow-xl
            z-50
          "
        >
          <button
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    onEdit()
  }}
  className="
    w-full text-left
    px-3 py-2
    text-sm text-zinc-200
    hover:bg-zinc-800
    rounded-lg
  "
>
  Edit
</button>

        </div>
      )}
    </div>
  )
}
