"use client";

import React, { useState, useEffect } from "react";
import { CategoryView } from "@/components/CategoryView";
import { PRODUCTS, Product } from "@/data/products";

export default function TShirtsPage() {
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
    (p) => p.category === "t-shirts" || (p as any).categories?.includes("t-shirts")
  );

  return (
    <CategoryView
      title="QRAFİK KÖYNƏKLƏR"
      badge="280 GSM HEAVYWEIGHT"
      categoryCode="CAT.03"
      description="280 GSM qalın pambıq parçadan hazırlanmış, xüsusi boyama və Azərbaycan naxışları ilə bəzədilmiş qrafik köynəklər."
      products={items}
    />
  );
}
