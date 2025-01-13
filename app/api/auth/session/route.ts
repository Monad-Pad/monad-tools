import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("mt-account-cookie");
    
    return NextResponse.json({
        authenticated: !!authCookie
    });
} 