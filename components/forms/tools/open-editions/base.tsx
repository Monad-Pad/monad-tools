"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import React from "react";
import { FormCreateTokenToken } from "./nft";

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
	tokenImage: z.instanceof(File).refine((file) => file.size !== 0, "Please upload an image"),
	tokenDecimals: z
		.number()
		.min(1, {
			message: "Token decimals must be at least 1.",
		})
		.max(18, {
			message: "Token decimals must not be more than 18.",
		}),
});

export function FormCreateOpenEditionsBase() {
	const [isCreating, setIsCreating] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsCreating(true);

		setTimeout(() => {
			setIsCreating(false);
		}, 3000);
	}

	return (
		<Form {...form}>
			<form id="create-token-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormCreateTokenToken form={form} />
				<Button size="sm" type="submit" disabled={isCreating} form="create-token-form">
					{isCreating ? "Creating token..." : "Create Token"}
				</Button>
			</form>
		</Form>
	);
}
