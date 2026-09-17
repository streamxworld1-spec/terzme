"use client";

import React, { useState, useEffect } from "react";
import { CategoryView } from "@/components/CategoryView";
import { PRODUCTS, Product } from "@/data/products";

export default function BestsellersPage() {
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
    (p) => p.category === "bestsellers" || (p as any).categories?.includes("bestsellers")
  );

  return (
    <CategoryView
      title="ƏN ÇOX SATILANLAR"
      badge="TOP RATED ARCHIVE"
      categoryCode="CAT.02"
      description="İkonik və ən çox seçilən parçalar. Yüksək tələbat görən və TERZME stilini formalaşdıran unikal dizaynlar."
      products={items}
    />
  );
}
