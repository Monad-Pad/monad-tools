import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { upload } from "thirdweb/storage";
import { backendClient } from "@/lib/clients/thirdweb";
import { supabaseServer } from "@/lib/clients/supabase";

export async function POST(request: NextRequest) {
	const cookieStore = cookies();
	const token = cookieStore.get("mt-account-cookie");
	const formData = await request.formData();
	const file = formData.get("file") as File;

	if (!token) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const tokenData = verify(token.value, process.env.SUPABASE_JWT_SECRET!);

	if (!tokenData) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

    const { data, error } = await supabaseServer.rpc("check_upload_rate_limit", {
        wallet_addr: tokenData.sub
    });
    console.log(data, error);
    const isNotRatelimited = data;

    console.log(isNotRatelimited);

    if (!isNotRatelimited) {
        return NextResponse.json({ success: false, error: "Try again later, you've hit the rate limit." }, { status: 429 });
    }

    let url = "";
    try {
        const result = await upload({
            client: backendClient,
            files: [file],
        })

        url = result;

        await supabaseServer.from("ipfs_uploads").insert({
            wallet_address: tokenData.sub,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Error uploading to IPFS" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { url } });
}
