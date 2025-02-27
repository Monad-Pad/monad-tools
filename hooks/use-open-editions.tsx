"use client";

import { ethers } from "ethers";
import { writeContract, readContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/lib/clients/wagmi";
import { toast } from "sonner";
import { openEditionFactoryAbi } from "@/lib/abis/open-edition-factory";
import { EXPLORER_URL, OPEN_EDITION_FACTORY_CONTRACT_ADDRESS } from "@/lib/constants";
import { decodeEventLog, parseEther } from "viem";
import { openEditionAbi } from "@/lib/abis/open-edition";

export default function useOpenEditions() {
	async function createOpenEdition({
		name,
		symbol,
		baseURI,
		mintPrice,
		startTime,
		endTime,
		maxSupply,
		maxPerTx,
		maxPerWallet,
	}: {
		name: string;
		symbol: string;
		baseURI: `ipfs://${string}`;
		mintPrice: BigInt;
		startTime: number;
		endTime: number;
		maxSupply: number;
		maxPerTx: number;
		maxPerWallet: number;
	}) {
		try {
			const result = await writeContract(config, {
			  abi: openEditionFactoryAbi,
			  address: OPEN_EDITION_FACTORY_CONTRACT_ADDRESS,
			  functionName: "createOpenEdition",
			  args: [name, symbol, baseURI, mintPrice, startTime, endTime, maxSupply, maxPerTx, maxPerWallet],
			});
		  
			// Wait for transaction to be mined
			const receipt = await waitForTransactionReceipt(config, {
			  hash: result,
			});
		  
			let collectionAddress: `0x${string}` | undefined;
			// Get the OpenEditionCreated event from the logs
			const event = decodeEventLog({
			  abi: openEditionFactoryAbi,
			  data: receipt.logs[1].data,
			  topics: receipt.logs[1].topics,
			});

			// @ts-ignore
			collectionAddress = event.args.collectionAddress;
			
			return collectionAddress;
		  } catch (error) {
			console.error(error);
			toast.error("Failed to create open edition");
		  }
	}

	async function getMintedTokens(collectionAddress: `0x${string}`) {
		const mintedTokens = await readContract(config, {
			abi: openEditionAbi,
			address: collectionAddress,
			functionName: "currentTokenId",
		});

		return Number(mintedTokens);
	}

	async function mintOpenEdition(collectionAddress: `0x${string}`, amount: number, mintPrice: number) {
		let signature: `0x${string}` | undefined;
		return toast.promise(
			async () => {
				try {
					const result = await writeContract(config, {
						abi: openEditionAbi,
						address: collectionAddress,
						functionName: "mint",
						args: [amount],
						value: parseEther(String(Number(mintPrice) * amount))
					});
					
					if (!result) {
						throw new Error("Transaction failed - no signature returned");
					}
					
					signature = result;
					
					return result;
				} catch (error) {
					console.error("Mint error:", error);
					throw error; // Re-throw to trigger toast error
				}
			},
			{
				loading: `Minting ${amount} NFTs...`,
				success: () => (
					<div className="flex items-center gap-1.5">
						Successfully minted {amount} NFTs!
						<a 
							href={`${EXPLORER_URL}/tx/${signature}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline"
						>
							View on explorer
						</a>
					</div>
				),
				error: 'Failed to mint NFTs'
			}
		);
	}

	return { createOpenEdition, getMintedTokens, mintOpenEdition };
}