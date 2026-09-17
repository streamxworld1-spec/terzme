"use client";

import { TerzmeHeader } from "./TerzmeHeader";

// Universal Navbar across all pages to keep 100% consistent green top bar & logo
export function Navbar({ onOpenAuth, className = "" }: { onOpenAuth?: () => void; className?: string } = {}) {
  return <TerzmeHeader />;
}
