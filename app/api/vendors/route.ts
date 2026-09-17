import { NextResponse } from "next/server";
import { getVendors, saveVendorAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const vendors = await getVendors();
  return NextResponse.json(vendors);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await saveVendorAction(data);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Xəta baş verdi" }, { status: 500 });
  }
}
