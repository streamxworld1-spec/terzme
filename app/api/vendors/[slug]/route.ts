import { NextResponse } from "next/server";
import { getVendorBySlug } from "@/app/actions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) {
    return NextResponse.json({ error: "Mağaza tapılmadı" }, { status: 404 });
  }
  return NextResponse.json(vendor);
}
