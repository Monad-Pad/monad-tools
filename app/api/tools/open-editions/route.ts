import { supabaseServer } from "@/lib/clients/supabase";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JwtPayload } from 'jsonwebtoken';
import createSlug from "@/lib/helpers/create-slug";

export async function POST(req: Request) {
    const { data, contractAddress } = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get("mt-account-cookie");

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = verify(token.value, process.env.SUPABASE_JWT_SECRET!) as JwtPayload;

    if (!user || !user.address) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const slug = await createSlug(data.name, "nft_collections")

    const { error } = await supabaseServer.from("nft_collections").insert({
        data,
        contract_address: contractAddress,
        creator_address: user.address,
        starts_at: new Date(data.startsAt),
        ends_at: new Date(data.endsAt),
        slug: slug
    });

    if (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to create NFT collection" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { slug: slug } });
}