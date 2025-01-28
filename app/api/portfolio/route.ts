import { supabaseServer } from "@/lib/clients/supabase";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const cookieStore = cookies();
    const token = cookieStore.get("mt-account-cookie");

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = verify(token.value, process.env.SUPABASE_JWT_SECRET!) as JwtPayload;

    if (!user || !user.address) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServer.from("created_tokens").select("signature, symbol, name, token_address, supply, created_at").eq("creator_address", user.address).order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch tokens" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 });
}