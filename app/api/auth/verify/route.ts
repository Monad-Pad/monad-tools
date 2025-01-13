import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { message, signature } = await req.json();

        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.verify({ signature });

        const cookieStore = cookies();
        const nonce = cookieStore.get("siwe-nonce");

        if (!nonce || fields.data.nonce !== nonce.value) {
            return NextResponse.json({ error: "Invalid nonce" }, { status: 422 });
        }

        const address = fields.data.address;

        const payload = {
            aud: "authenticated",
            role: "authenticated",
            sub: address,
            address: address,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
        };

        if (!process.env.SUPABASE_JWT_SECRET) {
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        const token = sign(payload, process.env.SUPABASE_JWT_SECRET);
        
        // Set cookie with proper options
        cookieStore.set("mt-account-cookie", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
        });

        return NextResponse.json({ 
            user: { address },
            success: true 
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
}
