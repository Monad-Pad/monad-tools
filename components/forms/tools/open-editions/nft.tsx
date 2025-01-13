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
import { TextareaWithCharCount } from "@/components/ui/textarea-char-count";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface OpenEditionsFormProps {
	form: UseFormReturn<any>;
}

export function FormCreateOpenEditions({ form }: OpenEditionsFormProps) {
	const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(null);

	const symbol = form.watch("symbol");
	const supply = form.watch("supply");
	const title = form.watch("name");

	const onLogoDrop = useCallback(
		(acceptedFiles: File[]) => {
			const reader = new FileReader();
			try {
				reader.onload = () => setLogoPreview(reader.result);
				reader.readAsDataURL(acceptedFiles[0]);
				form.setValue("image", acceptedFiles[0]);
				form.clearErrors("image");
			} catch (error) {
				setLogoPreview(null);
				form.resetField("image");
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
		maxSize: 1000000, // 1MB
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
		if (supply && Number(supply) < 1) {
			form.setValue("supply", "1");
			toast.error("Supply must be at least 1.");
		} else if (supply && Number(supply) > 1e12) {
			const formattedValue = "1,000,000,000,000";
			form.setValue("supply", formattedValue, { shouldValidate: true });
			toast.error("Supply must not be more than 1 trillion.");
		}
	}, [form, supply]);

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

	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Name <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<InputWithCharCount maxLength={30} minLength={3} placeholder="Enter in your NFT name, e.g. My NFT" {...field} />
						</FormControl>
						<FormDescription>Min 3 characters, max 30 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="symbol"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Symbol <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<InputWithCharCount maxLength={9} minLength={3} placeholder="Enter in your NFT symbol, e.g. MYNFT" {...field} />
						</FormControl>
						<FormDescription>Min 3 characters, max 9 characters</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="supply"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Supply <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<TokenAmountInput name="supply" placeholder="Enter in your NFT supply, e.g. 1,000" tokenSymbol={symbol} control={form.control} />
						</FormControl>
						{/* <FormDescription>This is your public display name.</FormDescription> */}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Description <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<TextareaWithCharCount maxLength={1000} minLength={1} placeholder="Enter in your NFT description, e.g. This is my NFT" {...field} />
						</FormControl>
						{/* <FormDescription>This is your public display name.</FormDescription> */}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="image"
				render={() => (
					<FormItem className="flex-shrink-0">
						<FormLabel className={`${logoFileRejections.length !== 0 && "text-destructive"}`}>
							Image <RequiredAsterix />
							<span
								className={form.formState.errors.image || logoFileRejections.length !== 0 ? "text-destructive" : "text-muted-foreground"}
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
											alt="Uploaded NFT image"
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
						<FormDescription>
							Image must be less than 1MB and of type png, jpg, webp, or jpeg
						</FormDescription>
					</FormItem>
				)}
			/>
			<DateTimePicker name="startsAt" control={form.control} label="Mint opens" />
			<DateTimePicker name="endsAt" control={form.control} label="Mint closes" />
			<FormField
				control={form.control}
				name="price"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							Price <RequiredAsterix />
						</FormLabel>
						<FormControl>
							<TokenAmountInput name="price" placeholder="Enter the price" tokenSymbol={"DMON"} control={form.control} />
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
