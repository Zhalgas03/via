import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCartButton from "./AddToCartButton"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

async function getProduct(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/products/${id}`,
    { cache: "no-store" }
  )

  if (!res.ok) notFound()
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className=" py-6 max-w-7xl mx-auto">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-zinc-400 mb-8">
        <Link
          href="/products"
          className="flex items-center gap-1 hover:text-zinc-300 transition text-decoration-none" style={{color: "#9ca3af"}}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Товары</span>
        </Link>

        <span className="text-zinc-600">/</span>
        <span className="truncate">{product.name}</span>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-12">
        {/* IMAGE */}
        <div className="bg-neutral-800 rounded-2xl aspect-square relative overflow-hidden">
  {product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      className="object-cover"
      priority
    />
  ) : (
    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
      Нет изображения
    </div>
  )}
</div>


        {/* INFO */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">
              {product.name}
            </h1>
            <div className="mt-2 text-2xl font-medium">
              {product.price} ₸
            </div>
          </div>

          {/* BUY */}
          <div>
            <div className="mb-2 text-sm text-zinc-400">
              Ваш заказ
            </div>
            <AddToCartButton productId={product.id} />
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-5 pt-6 border-t border-zinc-800 text-sm">
            <Spec label="Тара / Литры" value={product.volumeLiters} />
            <Spec label="Категория" value={product.category} />
            <Spec label="Цена" value={`${product.price} ₸`} />
            <Spec label="Описание" value={product.description} />
            <Spec label="Количество в упаковке" value={product.packageCount} />
            <Spec label="Поставщик" value={product.supplier} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* helper */
function Spec({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  return (
    <div>
      <div className="text-zinc-500">{label}</div>
      <div className="text-zinc-200">{value ?? "—"}</div>
    </div>
  )
}
