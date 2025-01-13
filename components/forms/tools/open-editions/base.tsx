"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import React from "react";
import { FormCreateOpenEditions } from "./nft";
import { toast } from "sonner";
import { convertIpfsUrl } from "@/lib/helpers/convert-ipfs";
import useOpenEditions from "@/hooks/use-open-editions";
import { useRouter } from "next/navigation";

// Form schema
const formSchema = z.object({
	name: z
		.string()
		.min(3, {
			message: "Token name must be at least 3 characters.",
		})
		.max(30, {
			message: "Token name must not be more than 30 characters.",
		}),
	symbol: z
		.string()
		.min(3, {
			message: "Token symbol must be at least 3 characters.",
		})
		.max(9, {
			message: "Token symbol must not be more than 9 characters.",
		}),
	supply: z.string(),
	image: z.instanceof(File).refine((file) => file.size !== 0, "Please upload an image"),
	description: z.string(),
	startsAt: z.date(),
	endsAt: z.date(),
	price: z.string()
});

export function FormCreateOpenEditionsBase() {
	const router = useRouter();

	const [isCreating, setIsCreating] = useState(false);
	const [slug, setSlug] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: "0.01",
			startsAt: new Date(new Date().getTime() + 1000 * 60 * 5), // 5 mins from now
			endsAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14), // 2 weeks from now
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsCreating(true);

		try {
			const uploadResponse = toast.promise(
				async () => {
					const formData = new FormData();
					formData.append("file", values.image);

					const uploadResponse = await fetch("/api/upload-ipfs", {
						method: "POST",
						body: formData,
					});

					if (!uploadResponse.ok) {
						const error = await uploadResponse.json();
						throw new Error(error.error);
					}

					return await uploadResponse.json();
				},
				{
					loading: 'Uploading image to IPFS...',
					success: 'Image uploaded successfully!',
					error: (err) => `Upload Error: ${err.message || 'Failed to upload image'}`
				}
			);

			const uploadResult = await uploadResponse.unwrap();

			const createContractPromise = toast.promise(
				async () => {
					const result = await useOpenEditions().createOpenEdition({
						name: values.name,
						symbol: values.symbol,
						baseURI: uploadResult.data.url,
						mintPrice: BigInt(Number(values.price) * 10 ** 18),
						startTime: Math.floor(values.startsAt.getTime() / 1000),
						endTime: Math.floor(values.endsAt.getTime() / 1000),
						maxSupply: Number(values.supply),
					});

					if (!result) {
						// throw new Error("Failed to deploy to chain");
					}
					return result;
				},
				{
					loading: 'Awaiting signature...',
					success: 'Signature received!',
					error: (err) => `Deployment Error: ${err.message || 'Failed to deploy on-chain'}`
				}
			);

			const contractAddress = await createContractPromise.unwrap();

			const createOpenEditionPromise = toast.promise(
				async () => {
					const response = await fetch("/api/tools/open-editions", {
						method: "POST",
						body: JSON.stringify({
							data: { ...values, image: convertIpfsUrl(uploadResult.data.url) },
							contractAddress: contractAddress,
						}),
					});

					if (!response.ok) {
						throw new Error("Failed to deploy on-chain");
					}

					return await response.json();
				},
				{
					loading: 'Deploying your open edition on-chain...',
					success: 'Open edition deployed successfully!',
					error: (err) => `Deployment Error: ${err.message || 'Failed to deploy on-chain'}`
				}
			);

			const createOpenEdition = await createOpenEditionPromise.unwrap();
			console.log(createOpenEdition);
			setSlug(createOpenEdition.data.slug);

		} finally {
			setIsCreating(false);
		}
	}

	useEffect(() => {
		if (slug) {
			router.push(`/mint/${slug}`);
			toast.success("Welcome to your open edition minting page!")
		}
	}, [slug]);

	return (
		<Form {...form}>
			<form id="create-open-editions-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormCreateOpenEditions form={form} />
				<Button size="sm" type="submit" disabled={isCreating} form="create-open-editions-form">
					{isCreating ? "Creating open editions..." : "Create Open Editions"}
				</Button>
			</form>
		</Form>
	);
}
