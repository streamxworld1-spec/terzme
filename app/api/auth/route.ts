import { NextResponse } from "next/server";
import { getUserAccounts, saveUserAccountAction } from "@/app/actions";

export const dynamic = "force-dynamic";

// POST /api/auth: Handles secure login, registration, and Google OAuth user resolution server-side
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, usernameOrEmail, password, email, username, name, avatar } = body;

    const users = await getUserAccounts();

    if (action === "login") {
      const input = (usernameOrEmail || email || "").trim().toLowerCase();
      const pass = (password || "").trim();

      if (!input || !pass) {
        return NextResponse.json({ success: false, error: "Giriş məlumatlarını daxil edin" }, { status: 400 });
      }

      const found = users.find((u) => 
        u.email.toLowerCase() === input || 
        u.username.toLowerCase() === input
      );

      if (!found) {
        return NextResponse.json({ 
          success: false, 
          error: "Bu istifadəçi adı və ya e-poçt ilə hesab tapılmadı. Qeydiyyat bölməsindən yeni hesab yaradın." 
        }, { status: 404 });
      }

      if (found.status === "suspended") {
        return NextResponse.json({
          success: false,
          error: "Bu hesab Super Admin tərəfindən dayandırılıb. Dəstək xidmətinə müraciət edin."
        }, { status: 403 });
      }

      if (found.password && found.password !== pass) {
        return NextResponse.json({ success: false, error: "Daxil edilən şifrə yanlışdır." }, { status: 401 });
      }

      // Safe user object (do NOT return password)
      const { password: _, ...safeUser } = found;
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === "register") {
      const uEmail = (email || "").trim().toLowerCase();
      const uName = (name || "").trim();
      const uUsername = (username || uEmail.split("@")[0]).trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
      const uPass = (password || "").trim();

      if (!uEmail || !uPass || uPass.length < 8) {
        return NextResponse.json({ success: false, error: "Şifrə minimum 8 simvoldan ibarət olmalıdır." }, { status: 400 });
      }

      const existing = users.find((u) => u.email.toLowerCase() === uEmail || u.username.toLowerCase() === uUsername);
      if (existing) {
        return NextResponse.json({ success: false, error: "Bu email və ya istifadəçi adı artıq qeydiyyatdan keçib." }, { status: 409 });
      }

      // STRICT SECURITY: Public registration CANNOT register as admin
      const res = await saveUserAccountAction({
        email: uEmail,
        name: uName || uUsername,
        username: uUsername,
        password: uPass,
        role: "customer", // Strict default
        status: "active",
      });

      if (res.success && res.user) {
        const { password: _, ...safeUser } = res.user;
        return NextResponse.json({ success: true, user: safeUser });
      } else {
        return NextResponse.json({ success: false, error: res.error || "Qeydiyyat alınmadı" }, { status: 500 });
      }
    }

    if (action === "google") {
      const gEmail = (email || "").trim().toLowerCase();
      const gName = (name || gEmail.split("@")[0]).trim();
      const gUsername = (username || gEmail.split("@")[0]).trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

      let found = users.find((u) => u.email.toLowerCase() === gEmail);

      if (!found) {
        // Auto-provision regular customer account for Google user
        const res = await saveUserAccountAction({
          email: gEmail,
          name: gName,
          username: gUsername,
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(gName)}&backgroundColor=07241a`,
          role: "customer",
          status: "active",
          password: "google_oauth_authenticated",
        });
        if (res.success && res.user) {
          found = res.user;
        }
      }

      if (found?.status === "suspended") {
        return NextResponse.json({
          success: false,
          error: "Bu hesab Super Admin tərəfindən dayandırılıb."
        }, { status: 403 });
      }

      if (found) {
        const { password: _, ...safeUser } = found;
        return NextResponse.json({ success: true, user: safeUser });
      }
    }

    return NextResponse.json({ success: false, error: "Naməlum sorğu" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Server xətası" }, { status: 500 });
  }
}
