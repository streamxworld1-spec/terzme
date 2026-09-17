"use client";

import React, { useState, useEffect } from "react";
import { CategoryView } from "@/components/CategoryView";
import { PRODUCTS, Product } from "@/data/products";

export default function HoodiesPage() {
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
    (p) => p.category === "hoodies" || (p as any).categories?.includes("hoodies")
  );

  return (
    <CategoryView
      title="HUDİLƏR VƏ SVİTERLƏR"
      badge="450 GSM FLEECE BALAM"
      categoryCode="CAT.04"
      description="Azərbaycan tərzi 450 GSM heavyweight fleece parçalar. Əl işi jakarlı toxuma, soyuq havalar üçün xüsusi istilik təcridi və qüsursuz geniş (boxy) kəsim."
      products={items}
    />
  );
}
