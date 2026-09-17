"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Store,
  Menu,
  X,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Vendor } from "@/app/actions";
import { AnnouncementBar } from "@/components/AnnouncementBar";

export function TerzmeHeader() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, openAuthModal, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userStore, setUserStore] = useState<{ slug: string; name: string } | null>(null);

  // Check if current logged-in user owns a store (by email, ownedStoreSlug, or username)
  useEffect(() => {
    if (!user) {
      setUserStore(null);
      return;
    }

    // Direct match from user session
    if (user.ownedStoreSlug) {
      setUserStore({
        slug: user.ownedStoreSlug,
        name: user.ownedStoreName || "Mağazam",
      });
      return;
    }

    // Lookup live vendors list by user email or username
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((vendors: Vendor[]) => {
        if (Array.isArray(vendors) && user.email) {
          const userEmailNorm = user.email.toLowerCase().trim();
          const found = vendors.find((v) => {
            const vEmail = (v.email || "").toLowerCase().trim();
            const vOwner = (v.ownerEmail || "").toLowerCase().trim();
            const vSlug = (v.slug || "").toLowerCase().trim();
            const uName = (user.username || "").toLowerCase().trim();

            return (
              vEmail === userEmailNorm ||
              vOwner === userEmailNorm ||
              (uName && (vSlug === uName || vEmail.includes(uName)))
            );
          });

          if (found) {
            setUserStore({
              slug: found.slug,
              name: found.name,
            });
          } else {
            setUserStore(null);
          }
        }
      })
      .catch(() => {});
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Mağazalar", href: "/stores" },
    { label: "Sifarişimi izlə", href: "/track" },
    { label: "Haqqımızda", href: "/about" },
    { label: "Əlaqə", href: "/contact" },
  ];

  return (
    <>
      <AnnouncementBar />
      <header className="w-full bg-[#07241A] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/trz-logo-white.png"
              alt="TRZ Changers"
              className="h-6 sm:h-7.5 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-sans text-neutral-300 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors tracking-wide hover:underline underline-offset-8 decoration-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT: SEARCH BAR + ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* SEARCH INPUT WITH PILL BORDER */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative w-64 lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Məhsul, marka və ya mağaza axtar..."
              className="w-full h-10 pl-4 pr-10 rounded-full bg-black/30 border border-white/15 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 focus:bg-black/40 transition-all font-sans"
            />
            <button type="submit" className="absolute right-3 text-neutral-400 hover:text-white transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* ICONS GROUP: FAVORITES, CART, PROFILE */}
          <div className="flex items-center gap-4 text-neutral-300">
            <Link 
              href="/wishlist" 
              className="p-1 hover:text-white transition-colors cursor-pointer relative"
              title="Bəyəndiklərim (Wishlist)"
            >
              <Heart className="w-5 h-5 stroke-[1.7]" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:text-white transition-colors cursor-pointer relative"
              title="Səbət"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.7]" />
              <span className="absolute -top-1.5 -right-2 bg-emerald-400 text-neutral-950 text-[10px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            </button>

            {/* PROFILE / GOOGLE AUTH BUTTON */}
            {/* PROFILE / GOOGLE AUTH BUTTON */}
            {user ? (
              <div className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all shadow-2xs">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 group cursor-pointer"
                  title={`${user.name} (${user.email}) — İdarə Paneli`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-400/80 group-hover:scale-105 transition-transform"
                  />
                  <span className="hidden sm:inline text-xs font-mono font-bold text-white max-w-[90px] truncate tracking-wide group-hover:text-emerald-300 transition-colors">
                    {user.name.split(" ")[0]}
                  </span>
                </Link>

                <div className="w-[1px] h-3.5 bg-white/20 mx-1 hidden sm:block" />

                <button
                  onClick={logout}
                  className="p-1 text-neutral-300 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                  title="Hesabdan Çıxış"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Çıxış</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={openAuthModal} 
                className="p-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                title="Google ilə Daxil Ol"
              >
                <User className="w-5 h-5 stroke-[1.7]" />
                <span className="hidden lg:inline text-xs font-mono font-medium text-neutral-300">
                  Giriş
                </span>
              </button>
            )}
          </div>

          {/* CTA: DYNAMIC BUTTON (MAĞAZANI AÇ vs MAĞAZAYA BAX) */}
          {userStore ? (
            <Link
              href={`/admin/stores/${userStore.slug}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#07241A] font-black text-xs font-grotesk uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              title={`${userStore.name} idarəetmə panelinə keç`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>MAĞAZAYA BAX</span>
            </Link>
          ) : (
            <Link
              href="/open-store"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#07241A] font-bold text-xs font-grotesk uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            >
              MAĞAZANI AÇ
            </Link>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#051A13] border-t border-white/10 px-6 py-5 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Məhsul, marka və ya mağaza axtar..."
              className="w-full h-11 pl-4 pr-10 rounded-full bg-black/40 border border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-3 pt-2 text-sm font-sans font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-1 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Profile in Mobile Drawer */}
          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <img src={user.avatar} alt="" className="w-9 h-9 rounded-full border border-emerald-400 object-cover" />
                  <div>
                    <span className="text-xs font-bold text-white block font-sans">{user.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block truncate max-w-[170px]">{user.email}</span>
                  </div>
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Çıxış"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Çıxış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); openAuthModal(); }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 border border-white/20"
              >
                <User className="w-4 h-4" />
                <span>Google ilə Daxil Ol</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            {userStore ? (
              <Link
                href={`/admin/stores/${userStore.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-full bg-emerald-400 text-[#07241A] font-black text-xs font-grotesk uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>MAĞAZAYA BAX ({userStore.name})</span>
              </Link>
            ) : (
              <Link
                href="/open-store"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-full bg-white text-[#07241A] font-black text-xs font-grotesk uppercase tracking-wider flex items-center justify-center shadow-md"
              >
                MAĞAZANI AÇ
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
