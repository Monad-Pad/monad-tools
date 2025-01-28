"use client";

import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/lib/clients/wagmi";
import { toast } from "sonner";
import { TOKEN_MINT_FACTORY_CONTRACT_ADDRESS } from "@/lib/constants";
import { decodeEventLog } from "viem";
import { tokenFactoryAbi } from "@/lib/abis/token-factory";

export default function useTokenCreator() {
	async function createToken({ name, symbol, maxSupply }: { name: string; symbol: string; maxSupply: BigInt }) {
		try {
			const result = await writeContract(config, {
				abi: tokenFactoryAbi,
				address: TOKEN_MINT_FACTORY_CONTRACT_ADDRESS,
				functionName: "createToken",
				args: [name, symbol, maxSupply],
			});

			const receipt = await waitForTransactionReceipt(config, {
				hash: result,
			});

			let tokenAddress: `0x${string}` | undefined;
			const event = decodeEventLog({
				abi: tokenFactoryAbi,
				data: receipt.logs[1].data,
				topics: receipt.logs[1].topics,
			});

			// @ts-ignore
			tokenAddress = event.args.tokenAddress;

			return tokenAddress;
		} catch (error) {
			console.error(error);
			toast.error("Failed to create token");
		}
	}

    return {
        createToken,
    }
}