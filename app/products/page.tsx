// app/products/page.tsx
import ProductsClient from "./products-client"

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  })
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsClient products={products} />
}
