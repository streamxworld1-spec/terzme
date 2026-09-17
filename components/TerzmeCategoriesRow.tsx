"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES_DATA } from "@/data/mockupData";

export function TerzmeCategoriesRow() {
  return (
    <section className="w-full bg-[#F5F5F5] py-6 sm:py-8 border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* 8-COLUMN GRID: NO SCROLLBAR, FITS ALL 8 ITEMS PERFECTLY */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 w-full">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              href={`/collection?cat=${cat.slug}`}
              style={{ borderRadius: "2px" }}
              className="w-full h-26 sm:h-30 rounded-[2px] bg-white hover:bg-neutral-50 border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-between p-2.5 group cursor-pointer"
            >
              <div className="h-14 sm:h-16 w-full flex items-center justify-center pt-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-xs"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-sans font-bold text-neutral-800 group-hover:text-black text-center truncate w-full px-1 pb-0.5">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* 8-ci ELEMENT: BÜTÜN KATEQORİYALAR (DƏQİQ TERZMEE DİZAYNI) */}
          <Link
            href="/collection"
            style={{ borderRadius: "2px" }}
            className="w-full h-24 sm:h-28 rounded-[2px] bg-transparent hover:bg-white/50 transition-all flex flex-col items-center justify-center p-2 group cursor-pointer text-center"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-200 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-all mb-1 text-neutral-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-neutral-500 font-sans leading-tight">
              (Avtomobil xaric<br />bütün kateqoriyalar)
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
