"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Check, Loader2, X } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ value, onChange, label = "Məhsul Şəkli (Qalereyadan Yüklə və ya URL Daxil Et)" }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Fayl ölçüsü maksimum 10MB ola bilər.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "Şəkil yüklənmədi.");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Şəkil yüklənərkən internet xətası baş verdi.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase text-neutral-600 font-semibold block">
        {label}
      </label>

      {/* Upload Zone & Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview box */}
        <div className="sm:col-span-3 h-28 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative flex items-center justify-center group">
          {value ? (
            <>
              <Image
                src={value}
                alt="Uploaded product"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                title="Şəkli sil"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-neutral-400">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <span className="text-[10px] font-mono block">Şəkil yoxdur</span>
            </div>
          )}
        </div>

        {/* Upload Buttons & URL input */}
        <div className="sm:col-span-9 space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-mono font-medium hover:bg-black transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Qalereyadan Yüklənir...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Qalereyadan Seç (Kompüter / Telefon)
                </>
              )}
            </button>
            <span className="text-[11px] font-mono text-neutral-400">və ya birbaşa URL yazın</span>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL və ya qalereyadan seçilən fayl yolu (/uploads/...)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs font-mono focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
          />

          {uploadError && (
            <p className="text-[11px] text-red-600 font-mono">{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
