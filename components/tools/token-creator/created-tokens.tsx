"use client";

import { usePortfolio } from "@/hooks/use-portfolio";
import { DbToken } from "@/types/tokens";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/tools/token-creator/table";
import { EXPLORER_URL } from "@/lib/constants";
import { formatAddress } from "@/lib/helpers/formatters/format-address";
import { formatTokenNumber } from "@/lib/helpers/formatters/format-number";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const columns: ColumnDef<DbToken>[] = [
	{
		accessorKey: "token_address",
		header: "Token Address",
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<a
					href={`${EXPLORER_URL}/token/${row.getValue("token_address")}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground underline hover:text-primary"
				>
					{formatAddress(row.getValue("token_address"))}
				</a>
				<Copy
					size={14}
					className="cursor-pointer text-muted-foreground hover:text-primary"
					onClick={() => {
						navigator.clipboard.writeText(row.getValue("token_address"));
						toast.success("Token address copied to clipboard");
					}}
				/>
			</div>
		),
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => (
			<p className="text-muted-foreground">
				{row.getValue("name")}
			</p>
		),
	},
	{
		accessorKey: "symbol",
		header: "Symbol",
		cell: ({ row }) => (
			<p className="text-muted-foreground">
				{row.getValue("symbol")}
			</p>
		),
	},
	// {
	// 	accessorKey: "signature",
	// 	header: "Signature",
	// 	cell: ({ row }) => (
	// 		<div className="flex items-center gap-1">
	// 			<a href={`${EXPLORER_URL}/tx/${row.getValue("signature")}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline hover:text-primary">
	// 				{formatAddress(row.getValue("signature"))}
	// 			</a>
	// 			<Copy
	// 				size={14}
	// 				className="cursor-pointer text-muted-foreground hover:text-primary"
	// 				onClick={() => {
	// 					navigator.clipboard.writeText(row.getValue("signature"));
	// 					toast.success("Signature copied to clipboard");
	// 				}}
	// 			/>
	// 		</div>
	// 	),
	// },
	{
		accessorKey: "supply",
		header: "Supply",
		cell: ({ row }) => (
			<p className="text-muted-foreground">
				{formatTokenNumber(row.getValue("supply"))}
			</p>
		),
	},
	{
		accessorKey: "created_at",
		header: "Created",
		cell: ({ row }) => (
			<p className="text-muted-foreground">
				{new Date(row.getValue("created_at")).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
			</p>
		),
	},
];

export function CreatedTokens() {
	const { tokens, isLoading, fetchTokens } = usePortfolio();
    const [isRefreshing, setIsRefreshing] = useState(false);

    async function handleRefresh() {
        setIsRefreshing(true);
        await fetchTokens();
        setIsRefreshing(false);
        toast.success("Tokens refreshed");
    }

	return (
		<div className="mt-16">
			<div className="flex justify-between items-center mb-1">
				<h2 className="text-base font-bold">Tokens you created</h2>
				<Button disabled={isRefreshing} variant="ghost" size="icon" onClick={handleRefresh}>
					<RefreshCcw size={14} className={cn(isRefreshing && "animate-spin")} />
				</Button>
			</div>
			<DataTable columns={columns} data={tokens} />
		</div>
	);
}
