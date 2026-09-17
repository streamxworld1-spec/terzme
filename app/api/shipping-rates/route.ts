import { NextResponse } from "next/server";
import { getShippingRates, updateShippingRatesAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getShippingRates();
  return NextResponse.json(rates);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await updateShippingRatesAction(body);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ success: false, error: "Xəta baş verdi" }, { status: 500 });
  }
}
