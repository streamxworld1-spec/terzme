import { NextResponse } from "next/server";
import { getAllProducts, saveProductAction, deleteProductAction } from "@/app/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || data.price === undefined) {
      return NextResponse.json({ success: false, error: "Məhsul adı və qiyməti mütləqdir" }, { status: 400 });
    }

    const res = await saveProductAction(data);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Xəta baş verdi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Məhsul ID-si daxil edilməyib" }, { status: 400 });
    }

    const res = await deleteProductAction(id);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || "Xəta baş verdi" }, { status: 500 });
  }
}
