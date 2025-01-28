"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import React from "react";
import { FormCreateTokenToken } from "./token";
import { useAccount } from "@/hooks/use-account";
import { toast } from "sonner";
import useTokenCreator from "@/hooks/use-token-creator";
import { EXPLORER_URL } from "@/lib/constants";
import { parseEther } from "viem";
import { usePortfolio } from "@/hooks/use-portfolio";

// Form schema
const formSchema = z.object({
	tokenName: z
		.string()
		.min(3, {
			message: "Token name must be at least 3 characters.",
		})
		.max(30, {
			message: "Token name must not be more than 30 characters.",
		}),
	tokenSymbol: z
		.string()
		.min(3, {
			message: "Token symbol must be at least 3 characters.",
		})
		.max(9, {
			message: "Token symbol must not be more than 9 characters.",
		}),
	tokenSupply: z.string(),
	// tokenImage: z.instanceof(File).refine((file) => file.size !== 0, "Please upload an image"),
	tokenDecimals: z
		.number()
		.min(1, {
			message: "Token decimals must be at least 1.",
		})
		.max(18, {
			message: "Token decimals must not be more than 18.",
		}),
});

export function FormCreateTokenBase() {
	const { address } = useAccount();
	const [isCreating, setIsCreating] = useState(false);
	const { fetchTokens } = usePortfolio();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tokenDecimals: 18,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		setIsCreating(true);

		let signature: `0x${string}` | undefined;
		const createContractPromise = toast.promise(
			async () => {
				const result = await useTokenCreator().createToken({
					name: values.tokenName,
					symbol: values.tokenSymbol,
					maxSupply: parseEther(values.tokenSupply),
				});

				if (!result) {
					throw new Error("Failed to deploy to chain");
				}

				signature = result;

				return result;
			},
			{
				loading: "Awaiting signature...",
				success: (
					<div className="flex items-center gap-1.5">
						Transaction sent!
						<a href={`${EXPLORER_URL}/tx/${signature}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">
							View on explorer
						</a>
					</div>
				),
				error: (err) => `Deployment Error: ${err.message || "Failed to deploy on-chain"}`,
			}
		);

		const createContractResult = await createContractPromise.unwrap();

		const createTokenPromise = toast.promise(
			async () => {
				const response = await fetch("/api/tools/token-creator", {
					method: "POST",
					body: JSON.stringify({
						signature: signature,
						supply: values.tokenSupply,
						tokenAddress: createContractResult,
						symbol: values.tokenSymbol,
						name: values.tokenName,
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to deploy on-chain");
				}

				return await response.json();
			},
			{
				loading: "Deploying your token on-chain...",
				success: (
					<div className="flex items-center gap-1.5">
						Token created successfully!
						<a href={`${EXPLORER_URL}/token/${createContractResult}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">
							View on explorer
						</a>
					</div>
				),
				error: (err) => `Deployment Error: ${err.message || "Failed to deploy on-chain"}`,
			}
		);

		await fetchTokens();
		setIsCreating(false);
	}

	return (
		<Form {...form}>
			<form id="create-token-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormCreateTokenToken form={form} />
				<Button size="sm" type="submit" disabled={isCreating || !address} form="create-token-form">
					{isCreating ? "Creating token..." : "Create Token"}
				</Button>
			</form>
		</Form>
	);
}
