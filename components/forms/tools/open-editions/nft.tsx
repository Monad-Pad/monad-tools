"use client";


import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import RequiredAsterix from "@/components/ui/required-asterix";
import { toast } from "sonner";
import React from "react";
import { TokenAmountInput } from "@/components/ui/input-token-amount";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputWithCharCount } from "@/components/ui/input-char-count";
import { UseFormReturn } from "react-hook-form";

interface TokenFormProps {
	form: UseFormReturn<any>;
}

export function FormCreateTokenToken({ form }: TokenFormProps) {
	const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(null);

	const tokenSymbol = form.watch("tokenSymbol");
	const tokenSupply = form.watch("tokenSupply");
	const tokenName = form.watch("tokenName");
	const tokenDecimals = form.watch("tokenDecimals");

	const onLogoDrop = useCallback(
		(acceptedFiles: File[]) => {
			const reader = new FileReader();
			try {
				reader.onload = () => setLogoPreview(reader.result);
				reader.readAsDataURL(acceptedFiles[0]);
				form.setValue("tokenImage", acceptedFiles[0]);
				form.clearErrors("tokenImage");
			} catch (error) {
				setLogoPreview(null);
				form.resetField("tokenImage");
			}
		},
		[form]
	);

	const {
		getRootProps: getLogoRootProps,
		getInputProps: getLogoInputProps,
		isDragActive: isLogoDragActive,
		fileRejections: logoFileRejections,
	} = useDropzone({
		onDrop: onLogoDrop,
		maxFiles: 1,
		maxSize: 1000000,
		accept: { "image/png": [], "image/jpg": [], "image/jpeg": [], "image/webp": [] },
	});
	// const debouncedValidation = useMemo(
	// 	() =>
	// 		debounce((field: string, value: string) => {
	// 			if (field === "tokenName") {
	// 				if (value.length > 0 && value.length < 3) {
	// 					toast.error("Token name must be at least 3 characters.");
	// 				} else if (value.length > 30) {
	// 					toast.error("Token name must not be more than 30 characters.");
	// 				}
	// 			} else if (field === "tokenSymbol") {
	// 				if (value.length > 0 && value.length < 3) {
	// 					toast.error("Token symbol must be at least 3 characters.");
	// 				} else if (value.length > 9) {
	// 					toast.error("Token symbol must not be more than 9 characters.");
	// 				}
	// 			}
	// 		}, 500),
	// 	[]
	// );

	useEffect(() => {
		if (tokenSupply && Number(tokenSupply) < 1) {
			form.setValue("tokenSupply", "1");
			toast.error("Token supply must be at least 1.");
		} else if (tokenSupply && Number(tokenSupply) > 1e12) {
			const formattedValue = "1,000,000,000,000";
			form.setValue("tokenSupply", formattedValue, { shouldValidate: true });
			toast.error("Token supply must not be more than 1 trillion.");
		}
	}, [form, tokenSupply]);

	// useEffect(() => {
	// 	if (tokenName) {
	// 		debouncedValidation("tokenName", tokenName);
	// 	}
	// }, [tokenName, debouncedValidation]);

	// useEffect(() => {
	// 	if (tokenSymbol) {
	// 		debouncedValidation("tokenSymbol", tokenSymbol);
	// 	}
	// }, [tokenSymbol, debouncedValidation]);

	useEffect(() => {
		if (tokenDecimals && tokenDecimals < 1) {
			form.setValue("tokenDecimals", tokenDecimals, { shouldValidate: true });
			toast.error("Token decimals must be at least 1.");
		} else if (tokenDecimals && tokenDecimals > 18) {
			form.setValue("tokenDecimals", tokenDecimals, { shouldValidate: true });
			toast.error("Token decimals must not be more than 18.");
		}
	}, [form, tokenDecimals]);
	return (
		<>
			<FormField
				control={form.control}
				name="tokenName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Name <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<InputWithCharCount maxLength={30} minLength={3} placeholder="Enter in your token name, e.g. My Token" {...field} />
						</FormControl>
						<FormDescription>Min 3 characters, max 30 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="tokenSymbol"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Symbol <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<InputWithCharCount maxLength={9} minLength={3} placeholder="Enter in your token symbol, e.g. MYT" {...field} />
						</FormControl>
						<FormDescription>Min 3 characters, max 9 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="tokenSupply"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Supply <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<TokenAmountInput
								name="tokenSupply"
								placeholder="Enter in your token supply, e.g. 100,000,000"
								tokenSymbol={tokenSymbol}
								control={form.control}
							/>
						</FormControl>
						{/* <FormDescription>This is your public display name.</FormDescription> */}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="tokenImage"
				render={() => (
					<FormItem className="flex-shrink-0">
						<FormLabel className={`${logoFileRejections.length !== 0 && "text-destructive"}`}>
							Image <RequiredAsterix />
							<span
								className={form.formState.errors.tokenImage || logoFileRejections.length !== 0 ? "text-destructive" : "text-muted-foreground"}
							></span>
						</FormLabel>
						<FormControl>
							<div
								{...getLogoRootProps()}
								className="size-64 flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border border-input p-4 shadow-sm overflow-hidden"
							>
								{logoPreview ? (
									<div className="w-full h-full flex items-center justify-center">
										<Image
											src={logoPreview as string}
											alt="Uploaded token image"
											className="size-full object-cover rounded-lg"
											width={200}
											height={200}
										/>
									</div>
								) : (
									<>
										<ImagePlus size={24} />
										<Input {...getLogoInputProps()} type="file" />
										<p className="text-sm text-muted-foreground font-medium text-center">
											{isLogoDragActive ? "Drop it!" : "Upload your image"}
										</p>
									</>
								)}
							</div>
						</FormControl>
						<FormMessage>
							{logoFileRejections.length !== 0 && (
								<p className="text-sm text-red-500 font-medium text-left">* Image must be less than 1MB and of type png, jpg, or jpeg</p>
							)}
						</FormMessage>
					</FormItem>
				)}
			/>
			<Accordion type="multiple" className="w-full">
				<AccordionItem className="p-0" value="step-1">
					<AccordionTrigger>
						<h2 className="text-sm text-muted-foreground font-semibold">Advanced Options</h2>
					</AccordionTrigger>
					<AccordionContent>
						<div className="border-l-2 border-l-input pl-4">
							<FormField
								control={form.control}
								name="tokenDecimals"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Decimals <RequiredAsterix />
										</FormLabel>
										<FormControl>
											<Input defaultValue={18} placeholder="Enter in your token decimals, e.g. 18" {...field} />
										</FormControl>
										<FormDescription>This is the number of decimal places your token will have.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}
