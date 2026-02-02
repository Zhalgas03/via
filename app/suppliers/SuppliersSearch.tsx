"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type Props = {
  query: string
  onQueryChange: (v: string) => void
}

export default function SuppliersSearch({
  query,
  onQueryChange,
}: Props) {
  return (
    <div className="relative" style={{ width: 280 }}>
     <MagnifyingGlassIcon
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          width: 16,
          height: 16,
          transform: "translateY(-50%)",
          color: "#9ca3af",
          pointerEvents: "none",
        }}
      />

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search"
        className="form-control"
        style={{
          backgroundColor: "#2e2e2e",
          color: "#e5e7eb",
          border: "1px solid #3a3f44",
          borderRadius: 8,
          fontSize: 14.5,
          padding: "8px 12px",
          paddingLeft: 38, 
        }}
      />

      <style jsx>{`
        input::placeholder {
          color: #9ca3af;
        }

        input:focus {
          background-color: #2a2d2f;
          border-color: #7a9432;
          box-shadow: 0 0 0 2px rgba(122, 148, 50, 0.25);
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}
