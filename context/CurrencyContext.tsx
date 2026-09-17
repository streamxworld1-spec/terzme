"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  flag: string;
  rateFromAZN: number; // Multiply AZN price by this to get foreign currency amount
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyOption> = {
  AZN: { code: "AZN", symbol: "₼", label: "AZN (₼)", flag: "🇦🇿", rateFromAZN: 1.0 },
  USD: { code: "USD", symbol: "$", label: "USD ($)", flag: "🇺🇸", rateFromAZN: 1 / 1.70 }, // 1 USD = 1.70 AZN
  EUR: { code: "EUR", symbol: "€", label: "EUR (€)", flag: "🇪🇺", rateFromAZN: 1 / 1.85 }, // 1 EUR = 1.85 AZN
  TRY: { code: "TRY", symbol: "₺", label: "TRY (₺)", flag: "🇹🇷", rateFromAZN: 20.0 },      // 1 AZN ≈ 20 TRY
  RUB: { code: "RUB", symbol: "₽", label: "RUB (₽)", flag: "🇷🇺", rateFromAZN: 52.0 },      // 1 AZN ≈ 52 RUB
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", flag: "🇬🇧", rateFromAZN: 1 / 2.15 }, // 1 GBP = 2.15 AZN
};

interface CurrencyContextType {
  currency: CurrencyOption;
  setCurrency: (currency: CurrencyOption) => void;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (aznAmount: number, options?: { showCode?: boolean }) => string;
  convertPrice: (aznAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyOption>(SUPPORTED_CURRENCIES.AZN);

  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const locale = (navigator.language || "").toLowerCase();
      const offset = new Date().getTimezoneOffset(); // -240 for UTC+4 (Baku)

      // 1. Azerbaijan detection (Timezone Baku, UTC+4 offset, or Azerbaijani language/locale)
      const isAzerbaijan =
        timeZone.toLowerCase().includes("baku") ||
        offset === -240 ||
        locale.includes("az") ||
        locale.includes("az-az");

      if (isAzerbaijan) {
        setCurrencyState(SUPPORTED_CURRENCIES.AZN);
        try {
          localStorage.setItem("terzme_currency", "AZN");
        } catch {}
        return;
      }

      // Check if international user previously saved another currency
      const savedCode = localStorage.getItem("terzme_currency");
      if (savedCode && SUPPORTED_CURRENCIES[savedCode]) {
        setCurrencyState(SUPPORTED_CURRENCIES[savedCode]);
        return;
      }

      // 2. Turkey detection: TRY
      if (timeZone.includes("Istanbul") || locale.includes("tr")) {
        setCurrencyState(SUPPORTED_CURRENCIES.TRY);
        return;
      }

      // 3. Russia detection: RUB
      if (
        timeZone.includes("Moscow") ||
        timeZone.includes("Samara") ||
        timeZone.includes("Yekaterinburg") ||
        timeZone.includes("Krasnoyarsk") ||
        timeZone.includes("Novosibirsk") ||
        timeZone.includes("Vladivostok") ||
        locale.includes("ru")
      ) {
        setCurrencyState(SUPPORTED_CURRENCIES.RUB);
        return;
      }

      // 4. Great Britain: GBP
      if (timeZone.includes("London") || locale === "en-gb") {
        setCurrencyState(SUPPORTED_CURRENCIES.GBP);
        return;
      }

      // 5. European Union / Europe detection: EUR auto
      const isEuropeanLocale = /^(de|fr|it|es|pt|nl|el|pl|cs|sk|hu|sv|fi|da|no|ro|bg|hr|et|lv|lt|sl|ga)/.test(locale);
      if (
        timeZone.startsWith("Europe/") ||
        timeZone.includes("Paris") ||
        timeZone.includes("Berlin") ||
        timeZone.includes("Rome") ||
        timeZone.includes("Madrid") ||
        timeZone.includes("Amsterdam") ||
        timeZone.includes("Brussels") ||
        timeZone.includes("Vienna") ||
        timeZone.includes("Warsaw") ||
        timeZone.includes("Prague") ||
        timeZone.includes("Budapest") ||
        timeZone.includes("Stockholm") ||
        timeZone.includes("Helsinki") ||
        timeZone.includes("Athens") ||
        timeZone.includes("Dublin") ||
        timeZone.includes("Lisbon") ||
        isEuropeanLocale
      ) {
        setCurrencyState(SUPPORTED_CURRENCIES.EUR);
        return;
      }

      // 6. United States / Americas detection: USD
      if (
        timeZone.includes("America/") ||
        timeZone.includes("US/") ||
        locale === "en-us"
      ) {
        setCurrencyState(SUPPORTED_CURRENCIES.USD);
        return;
      }

      // For any other international visitor, default to EUR
      setCurrencyState(SUPPORTED_CURRENCIES.EUR);
    } catch {
      // Fallback stays AZN
    }
  }, []);

  const setCurrency = (newCurrency: CurrencyOption) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("terzme_currency", newCurrency.code);
    } catch {
      // ignore
    }
  };

  const setCurrencyByCode = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrency(SUPPORTED_CURRENCIES[code]);
    }
  };

  const convertPrice = (aznAmount: number): number => {
    const converted = aznAmount * currency.rateFromAZN;
    return Math.round(converted * 100) / 100;
  };

  const formatPrice = (aznAmount: number, options?: { showCode?: boolean }): string => {
    const val = convertPrice(aznAmount);
    const formattedNum = val % 1 === 0 ? val.toFixed(0) : val.toFixed(2);
    
    if (currency.code === "AZN") {
      return `${formattedNum} ₼`;
    }
    
    if (options?.showCode) {
      return `${currency.symbol}${formattedNum} ${currency.code}`;
    }
    return `${currency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        setCurrencyByCode,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
