
"use client"

import { useState } from "react"
import SupplierModalDesign from "./SupplierDrawer"

export default function EditSupplierModal({
  supplier,
  open,
  onClose,
}: any) {
  const [loading, setLoading] = useState(false)

  if (!supplier) return null
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    await fetch(`/api/suppliers/${supplier.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        contactName: formData.get("contactName"),
      }),
    })

    setLoading(false)
    onClose()
    location.reload()
  }

  return (
    <SupplierModalDesign
      open={open}
      loading={loading}
      title="Edit supplier"
      submitText="Save"
      onClose={onClose}
      onSubmit={handleSubmit}
      nameDefault={supplier.name}
      phoneDefault={supplier.phone ?? ""}
      contactNameDefault={supplier.contactName ?? ""}
    />
  )
}
