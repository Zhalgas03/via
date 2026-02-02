"use client"

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"

const NAVBAR_HEIGHT = 56

type Props = {
  open: boolean
  loading: boolean
  title: string
  submitText: string

  showAddButton?: boolean
  onOpen?: () => void

  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void

  nameDefault?: string
  phoneDefault?: string
  contactNameDefault?: string
}

export default function SupplierModalDesign({
  open,
  loading,
  title,
  submitText,
  showAddButton = false,
  onOpen,
  onClose,
  onSubmit,
  nameDefault,
  phoneDefault,
  contactNameDefault,
}: Props) {
  return (
    <>
      {/* ADD BUTTON — 1:1 */}
      {showAddButton && (
        <div className="relative">
          <button
            onClick={onOpen}
            className={`
              h-10 px-3 pe-4
              flex items-center gap-2
              text-sm
              bg-[#7a9432]
              text-zinc-300
              transition
              ${open ? "invisible" : "visible"}
            `}
            style={{ borderRadius: "8px" }}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* OVERLAY */}
      <div
        className={`
          fixed inset-0 z-[100]
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* BACKDROP */}
        <div
          className={`
            absolute inset-0 bg-black/60
            transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}
          `}
          onClick={onClose}
        />

        {/* DRAWER */}
        <form
          onSubmit={onSubmit}
          className={`
            fixed right-0
            w-96
            bg-zinc-900
            border-l border-zinc-800
            flex flex-col
            transform transition-transform duration-300 ease-out
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
          style={{
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
        >
          {/* HEADER */}
          <div className="relative px-6 pt-4 pb-2 border-b border-zinc-800">
            <p className="text-xl font-semibold text-zinc-100">
              {title}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="
                absolute right-4 top-3
                h-10 w-10
                flex items-center justify-center
                rounded-lg
                text-zinc-400
                hover:text-zinc-200
                transition
              "
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">
                Имя поставщика
              </label>
              <input
                name="name"
                required
                defaultValue={nameDefault}
                className="form-control dark-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-400">
                Телефон
              </label>
              <input
                name="phone"
                defaultValue={phoneDefault}
                className="form-control dark-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-400">
                Имя представителя
              </label>
              <input
                name="contactName"
                defaultValue={contactNameDefault}
                className="form-control dark-input"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex gap-3 justify-start">
              <button
                type="submit"
                disabled={loading}
                className="
                  h-9 px-3
                  text-sm
                  rounded-lg
                  bg-[#7a9432]
                  text-zinc-300
                  transition
                  disabled:opacity-50
                "
                style={{ borderRadius: "8px", fontSize: "15px" }}
              >
                {loading ? "Saving…" : submitText}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="
                  h-9 px-3
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
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
