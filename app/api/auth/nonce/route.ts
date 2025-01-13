import { NextResponse } from "next/server";
import { generateNonce } from "siwe";
import { cookies } from 'next/headers';

export async function GET() {
	const nonce = generateNonce();
    if (!nonce) {
        return NextResponse.json({ nonce: null });
    }
    const cookieStore = cookies();
    cookieStore.set("siwe-nonce", nonce);

	return NextResponse.json({ nonce });
}
