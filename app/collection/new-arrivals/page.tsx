"use client";

import React, { useState, useEffect } from "react";
import { CategoryView } from "@/components/CategoryView";
import { PRODUCTS, Product } from "@/data/products";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const items = products.filter(
    (p) => p.category === "new-arrivals" || (p as any).categories?.includes("new-arrivals")
  );

  return (
    <CategoryView
      title="YENİ BURAXILIŞLAR"
      badge="SEASON 2026 // DROP 01"
      categoryCode="CAT.01"
      description="Mövsümün ən son unikal küçə tərzi. Hər bir parça məhdud sayda — cəmi 250 nüsxə olaraq Bakı emalatxanasında istehsal olunmuşdur."
      products={items}
    />
  );
}
