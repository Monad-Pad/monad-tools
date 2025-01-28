import { supabaseServer } from "@/lib/clients/supabase";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JwtPayload } from 'jsonwebtoken';

export async function POST(req: Request) {
    const { signature, symbol, name, supply, tokenAddress } = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get("mt-account-cookie");

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = verify(token.value, process.env.SUPABASE_JWT_SECRET!) as JwtPayload;

    if (!user || !user.address) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseServer.from("created_tokens").insert({
        signature,
        symbol,
        name,
        supply,
        token_address: tokenAddress,
        creator_address: user.address
    });

    if (error) {
        return NextResponse.json({ success: false, error: "Failed to create token" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}