"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Globe, ChevronRight } from "lucide-react";

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState("Dünyanın 196 ölkəsinə çatdırılma xidməti aktivdir");
  const [link, setLink] = useState("/collection");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.announcementEnabled !== undefined) {
            setEnabled(Boolean(data.announcementEnabled));
          }
          if (data.announcementText) {
            setAnnouncement(data.announcementText);
          }
          if (data.announcementLink !== undefined) {
            setLink(data.announcementLink);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!enabled || !announcement.trim()) {
    return null;
  }

  const content = (
    <div className="w-full bg-neutral-950 text-white text-[11px] font-mono py-2 px-4 flex items-center justify-center gap-2 tracking-wider uppercase border-b border-white/10 z-50 relative overflow-hidden group hover:bg-neutral-900 transition-colors">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate group-hover:underline underline-offset-4">{announcement}</span>
      {link && (
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold ml-1">
          <span>Kəşf et</span>
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
      <Globe className="w-3.5 h-3.5 text-white/60 shrink-0 hidden md:inline ml-1" />
    </div>
  );

  if (link && link.trim()) {
    return (
      <Link href={link.trim()} className="block w-full">
        {content}
      </Link>
    );
  }

  return <aside aria-label="Elan paneli">{content}</aside>;
}
