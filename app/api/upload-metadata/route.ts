import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { upload } from "thirdweb/storage";
import { backendClient } from "@/lib/clients/thirdweb";
import { supabaseServer } from "@/lib/clients/supabase";

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get("mt-account-cookie");

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = verify(token.value, process.env.SUPABASE_JWT_SECRET!);

    if (!tokenData) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, image, creator } = await request.json();

    const metadata = {
        name,
        description,
        image,
        creator,
        attributes: [
            {
                trait_type: "Type",
                value: "Open Edition"
            }
        ],
        properties: {
            category: "Image"
        }
    };

    let url = "";
    try {
        const result = await upload({
            client: backendClient,
            files: [metadata],
        });

        url = result;

        await supabaseServer.from("ipfs_uploads").insert({
            wallet_address: tokenData.sub,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Error uploading metadata to IPFS" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { url } });
} 