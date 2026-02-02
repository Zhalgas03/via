"use client"

type PageItem = number | "..."

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  function getPageRange(current: number, total: number): PageItem[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total]
    }

    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total]
    }

    return [
      1,
      "...",
      current - 1,
      current,
      current + 1,
      "...",
      total,
    ]
  }

  if (totalPages <= 1) return null

 return (
  <div className="flex justify-center items-center gap-4 pt-6">
    {/* PREVIOUS */}
    <button
      aria-label="Previous"
      onClick={() => onChange(Math.max(1, page - 1))}
      disabled={page === 1}
      className="
        h-9 w-9
        flex items-center justify-center
        rounded-md
        border border-zinc-600
        text-zinc-400 text-sm
        hover:bg-zinc-800 hover:text-zinc-200
        disabled:opacity-40 disabled:hover:bg-transparent
        transition-colors
      "
    >
      ‹
    </button>

    {/* PAGES */}
    <div className="flex items-center gap-2">
      {getPageRange(page, totalPages).map((p, idx) =>
        p === "..." ? (
          <button
            key={`dots-${idx}`}
            disabled
            className="
              h-7
              px-2
              flex items-center justify-center
              text-[11px]
              text-zinc-500
              cursor-default
            "
          >
            …
          </button>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => onChange(p)}
            disabled={page === p}
            className={`
              h-7
              px-2.5
              min-w-[28px]
              flex items-center justify-center
              text-[11px]
              rounded-md
              transition-colors duration-150
              ${
                page === p
                  ? "bg-[rgba(157,184,89,0.12)] text-[#9db859] cursor-default"
                  : "text-zinc-300 hover:text-zinc-100"
              }
            `}
          >
            {p}
          </button>
        )
      )}
    </div>

    {/* NEXT */}
    <button
      aria-label="Next"
      onClick={() => onChange(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
      className="
        h-9 w-9
        flex items-center justify-center
        rounded-md
        border border-zinc-600
        text-zinc-400 text-sm
        hover:bg-zinc-800 hover:text-zinc-200
        disabled:opacity-40 disabled:hover:bg-transparent
        transition-colors
      "
    >
      ›
    </button>
  </div>
)
}
