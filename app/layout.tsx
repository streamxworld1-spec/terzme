import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono, Kanit } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { GoogleAuthModal } from "@/components/GoogleAuthModal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const kanit = Kanit({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "TERZME. — Avant-Garde Streetwear & Atelier",
  description: "Futuristic Glassmorphic Fashion Experience by TERZME ATELIER BAKU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${kanit.variable}`}>
      <body className="font-sans antialiased selection:bg-neutral-900 selection:text-white">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <CartDrawer />
                <GoogleAuthModal />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
