import { supabaseServer } from "@/lib/clients/supabase";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { getTransaction } from "@wagmi/core";
import { config } from "@/lib/clients/wagmi";

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 5): Promise<any> {
	for (let i = 0; i < maxRetries; i++) {
		try {
			const response = await fetch(url, options);
			const result = await response.json();
			console.log(result);
			if (result?.result) return result.result;
		} catch (error) {
			if (i === maxRetries - 1) throw error;
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	throw new Error("Max retries reached");
}

export async function POST(req: Request) {
	const { signature } = await req.json();

	const cookieStore = cookies();
	const token = cookieStore.get("mt-account-cookie");

	if (!token) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const user = verify(token.value, process.env.SUPABASE_JWT_SECRET!) as JwtPayload;

	if (!user || !user.address) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const result = await fetchWithRetry(process.env.RPC_URL!, {
		method: "POST",
		body: JSON.stringify({
			jsonrpc: "2.0",
			method: "eth_getTransactionByHash",
			params: [signature],
			id: 1,
		}),
	});

	const contractAddress = result?.to;
	const minterAddress = result?.from;

	if (minterAddress.toLowerCase() != user.address.toLowerCase()) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const txResult = await fetchWithRetry(
		process.env.RPC_URL!,
		{
			method: "POST",
			body: JSON.stringify({
				jsonrpc: "2.0",
				method: "eth_getTransactionReceipt",
				params: [signature],
				id: 1,
			}),
		}
	);

	if (txResult.status !== "0x1") {
	return NextResponse.json({ success: false, error: "Transaction failed" }, { status: 400 });
}

	const { error } = await supabaseServer.from("minted_nfts").insert({
		contract_address: contractAddress.toLowerCase(),
		signature: signature,
		minter_address: user.address,
	});

	if (error) {
		console.log(error);
		return NextResponse.json({ success: false, error: "Failed to mint NFT" }, { status: 500 });
	}

	return NextResponse.json({ success: true }, { status: 200 });
}
