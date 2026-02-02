"use client"

import { useState } from "react"
import SupplierModalDesign from "./SupplierDrawer"

export default function AddSupplierModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        contactName: formData.get("contactName"),
      }),
    })

    setLoading(false)
    setOpen(false)
    location.reload()
  }

  return (
    <SupplierModalDesign
      showAddButton
      open={open}
      loading={loading}
      title="Add supplier"
      submitText="Submit"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
    />
  )
}
