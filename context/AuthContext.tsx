"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  role: "customer" | "vendor" | "admin";
  createdAt: string;
  ownedStoreSlug?: string;
  ownedStoreName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithCredentials: (usernameOrEmail: string, password: string) => { success: boolean; message?: string };
  registerWithCredentials: (data: { username: string; email: string; name: string; password: string }) => { success: boolean; message?: string };
  loginWithGoogleDirect: (customUser?: Partial<UserProfile>) => void;
  setOwnedStore: (slug: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: "customer" | "vendor" | "admin";
  createdAt: string;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: "usr_super_admin",
    name: "Super Admin",
    username: "admin",
    email: "admin@platform.local",
    password: "terzme1234",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=07241a",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_vendor_stx",
    name: "STX Studio",
    username: "stx",
    email: "iamgazanfar@gmail.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=STX&backgroundColor=07241a",
    role: "vendor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_vendor_terzme",
    name: "TERZME Store",
    username: "terzme_store",
    email: "store@terzme.az",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TERZME&backgroundColor=07241a",
    role: "vendor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_vendor_aggara",
    name: "AG'GARA Studio",
    username: "aggara",
    email: "info@aggara.az",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AGGARA&backgroundColor=07241a",
    role: "vendor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_customer_gazanfar",
    name: "Qəzənfər Yusifli",
    username: "gazanfar",
    email: "gazanfar@terzme.com",
    password: "gazanfar123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Gazanfar&backgroundColor=07241a",
    role: "customer",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_customer_aydan",
    name: "Aydan Əliyeva",
    username: "aydan",
    email: "aydan@gmail.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Aydan&backgroundColor=07241a",
    role: "customer",
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("terzme_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }

      // Initialize default registered accounts if none exist
      const accounts = localStorage.getItem("terzme_accounts");
      if (!accounts) {
        localStorage.setItem("terzme_accounts", JSON.stringify(DEFAULT_ACCOUNTS));
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (user) {
        localStorage.setItem("terzme_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("terzme_user");
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, mounted]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Login with Username or Email & Password (Strict Authentication)
  const loginWithCredentials = (usernameOrEmail: string, password: string): { success: boolean; message?: string } => {
    const input = usernameOrEmail.trim().toLowerCase();
    const pass = password.trim();

    if (!input) {
      return { success: false, message: "İstifadəçi adı və ya e-poçt daxil edin." };
    }
    if (!pass) {
      return { success: false, message: "Şifrəni daxil edin." };
    }
    if (pass.length < 8) {
      return { success: false, message: "Şifrə minimum 8 simvoldan ibarət olmalıdır." };
    }

    let accounts: StoredAccount[] = DEFAULT_ACCOUNTS;
    try {
      const saved = localStorage.getItem("terzme_accounts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) accounts = parsed;
      }
    } catch (e) {}

    const normalize = (str: string) =>
      (str || "")
        .toLowerCase()
        .replace(/ə/g, "e")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ç/g, "c")
        .replace(/ğ/g, "g")
        .replace(/[^a-z0-9]/g, "");

    const normInput = normalize(input);

    // Search by username, email, full name, or normalized equivalent
    const accountExists = accounts.find((acc) => {
      const accUsername = (acc.username || "").toLowerCase();
      const accEmail = (acc.email || "").toLowerCase();
      const accName = (acc.name || "").toLowerCase();

      return (
        accUsername === input ||
        accEmail === input ||
        accName === input ||
        normalize(accUsername) === normInput ||
        normalize(accEmail.split("@")[0]) === normInput ||
        normalize(accName) === normInput ||
        normalize(accName).includes(normInput) ||
        normInput.includes(normalize(accUsername))
      );
    });

    if (!accountExists) {
      return { 
        success: false, 
        message: "Bu istifadəçi adı, ad və ya e-poçt ilə hesab tapılmadı. Zəhmət olmasa 'QEYDİYYAT' bölməsindən yeni hesab yaradın." 
      };
    }

    if (accountExists.password !== pass) {
      return { 
        success: false, 
        message: "Daxil edilən şifrə yanlışdır. Zəhmət olmasa şifrənizi yoxlayıb yenidən cəhd edin." 
      };
    }

    const loggedUser: UserProfile = {
      id: accountExists.id,
      name: accountExists.name,
      username: accountExists.username,
      email: accountExists.email,
      avatar: accountExists.avatar,
      role: accountExists.role,
      createdAt: accountExists.createdAt,
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Register with Username, Email, Name & Password (Strict Validation)
  const registerWithCredentials = (data: {
    username: string;
    email: string;
    name: string;
    password: string;
  }): { success: boolean; message?: string } => {
    const username = data.username.trim().toLowerCase().replace(/\s+/g, "_");
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim() || username;
    const password = data.password.trim();

    if (!username || username.length < 3) {
      return { success: false, message: "İstifadəçi adı ən azı 3 simvoldan ibarət olmalıdır." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, message: "Düzgün bir e-poçt ünvanı daxil edin (məs: ad@domain.com)." };
    }

    if (!password || password.length < 8) {
      return { success: false, message: "Şifrə minimum 8 simvoldan ibarət olmalıdır." };
    }

    let accounts: StoredAccount[] = DEFAULT_ACCOUNTS;
    try {
      const saved = localStorage.getItem("terzme_accounts");
      if (saved) accounts = JSON.parse(saved);
    } catch (e) {}

    const existingUsername = accounts.find((a) => a.username.toLowerCase() === username);
    if (existingUsername) {
      return { success: false, message: "Bu istifadəçi adı artıq qeydiyyatdan keçib. Başqa bir istifadəçi adı seçin." };
    }

    const existingEmail = accounts.find((a) => a.email.toLowerCase() === email);
    if (existingEmail) {
      return { success: false, message: "Bu e-poçt ünvanı artıq mövcuddur. 'GİRİŞ' bölməsindən daxil olun." };
    }

    const safeId = "usr_" + username.replace(/[^a-z0-9_]/g, "_");
    const newAcc: StoredAccount = {
      id: safeId,
      name,
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=07241a`,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    try {
      accounts.push(newAcc);
      localStorage.setItem("terzme_accounts", JSON.stringify(accounts));
    } catch (e) {}

    setUser({
      id: newAcc.id,
      name: newAcc.name,
      username: newAcc.username,
      email: newAcc.email,
      avatar: newAcc.avatar,
      role: newAcc.role,
      createdAt: newAcc.createdAt,
    });
    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Direct / Quick Google Login Helper
  const loginWithGoogleDirect = (customUser?: Partial<UserProfile>) => {
    let accounts: StoredAccount[] = DEFAULT_ACCOUNTS;
    try {
      const saved = localStorage.getItem("terzme_accounts");
      if (saved) accounts = JSON.parse(saved);
    } catch (e) {}

    const email = (customUser?.email || "user@gmail.com").trim().toLowerCase();
    const name = customUser?.name || (customUser?.email ? customUser.email.split("@")[0] : "Google İstifadəçisi");
    const username = (customUser?.username || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "_");

    // Check if account already exists for this email
    let userAcc = accounts.find((a) => a.email.toLowerCase() === email || a.username.toLowerCase() === username);
    if (!userAcc) {
      userAcc = {
        id: "usr_" + username,
        name,
        username,
        email,
        password: "google_oauth_verified",
        avatar: customUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=07241a`,
        role: "customer",
        createdAt: new Date().toISOString(),
      };
      accounts.push(userAcc);
      try {
        localStorage.setItem("terzme_accounts", JSON.stringify(accounts));
      } catch (e) {}
    }

    const defaultUser: UserProfile = {
      id: userAcc.id,
      name: customUser?.name || userAcc.name,
      username: customUser?.username || userAcc.username,
      email: customUser?.email || userAcc.email,
      avatar: customUser?.avatar || userAcc.avatar,
      role: (customUser?.role as any) || userAcc.role,
      createdAt: userAcc.createdAt,
      ownedStoreSlug: customUser?.ownedStoreSlug,
      ownedStoreName: customUser?.ownedStoreName,
    };
    setUser(defaultUser);
    setIsAuthModalOpen(false);
  };

  const setOwnedStore = (slug: string, name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ownedStoreSlug: slug,
        ownedStoreName: name,
        role: "vendor" as const,
      };
      try {
        localStorage.setItem("terzme_user", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithCredentials,
        registerWithCredentials,
        loginWithGoogleDirect,
        setOwnedStore,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
