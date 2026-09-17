import { getAllProducts, getVendors } from "@/app/actions";
import ProductListClient from "./ProductListClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, vendors] = await Promise.all([
    getAllProducts(),
    getVendors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <ProductListClient initialProducts={products} initialVendors={vendors} />
    </div>
  );
}
