"use client";

import { Button } from "@/components/ui/button";
import useOpenEditions from "@/hooks/use-open-editions";
import { useEffect, useState } from "react";
import { MintButton } from "./mint-button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatAddress } from "@/lib/helpers/formatters/format-address";
import Link from "next/link";
import { Countdown } from "@/components/ui/countdown";
import { convertIpfsUrl } from "@/lib/helpers/convert-ipfs";
import Image from "next/image";

export function MintUI({ collectionAddress, data, collection }: { collectionAddress: `0x${string}`; data: any; collection: any }) {
	const { getMintedTokens } = useOpenEditions();
	const [mintedTokens, setMintedTokens] = useState(0);
	const [isMinting, setIsMinting] = useState(false);
    const [isNotPastEndTime, setIsNotPastEndTime] = useState(false);

	useEffect(() => {
		async function fetchMintedTokens() {
			const tokens = await getMintedTokens(collectionAddress);
			setMintedTokens(tokens as number);
		}
		fetchMintedTokens();
	}, [collectionAddress]);

	useEffect(() => {
		const now = new Date();
		const startDate = new Date(collection.starts_at);
		const endDate = new Date(collection.ends_at);
        console.log(startDate, endDate, now);

		if (startDate <= now && endDate > now) {
			setIsMinting(true);
		} else {
			setIsMinting(false);
		}
        if (endDate > now) {
            setIsNotPastEndTime(true);
        } else {
            setIsNotPastEndTime(false);
        }

        console.log(isMinting, isNotPastEndTime);
	}, [collection.starts_at, collection.ends_at]);

	return (
		<>
			<div className="flex flex-col justify-center gap-1">
				<h1 className="text-2xl md:text-3xl font-bold">
					{data.name} ({data.symbol})
				</h1>
				<p className="text-base md:text-lg text-muted-foreground font-medium">{data.description}</p>
				<Separator className="my-2" />
				<div>
					<p className="text-sm text-muted-foreground font-medium">
						Created by{" "}
						<Link
							href={`https://explorer.monad-devnet.devnet101.com/address/${collection.creator_address}`}
							target="_blank"
							className="text-primary underline"
						>
							{formatAddress(collection.creator_address)}
						</Link>
					</p>
				</div>
				<div className="flex flex-col gap-2 mt-6">
					<MintButton collectionAddress={collectionAddress} mintedTokens={mintedTokens} data={data} isMinting={isMinting} />
					<div className="w-full">
						<Progress value={(mintedTokens / data.supply) * 100} max={100} />
						<div className="flex justify-between">
							<p className="text-sm text-muted-foreground font-medium">{mintedTokens}</p>
							<p className="text-sm text-muted-foreground font-medium">{data.supply}</p>
						</div>
					</div>
					{!isMinting && isNotPastEndTime && (
						<div className="w-full lg:w-1/2 mt-4">
							<p className="text-sm uppercase text-muted-foreground font-semibold mb-1">
								{isMinting ? "Minting ends in" : "Minting starts in"}
							</p>
							<Countdown endsAt={isMinting ? collection.ends_at : collection.starts_at} size="full" />
						</div>
					)}
					{!isNotPastEndTime && (
						<div className="w-full mt-4">
							<p className="text-sm uppercase text-muted-foreground font-semibold mb-1">Minting ended</p>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Image unoptimized src={convertIpfsUrl(data.image)} alt={data.name} width={512} height={512} className="w-full aspect-square h-full object-cover rounded-2xl" />
			</div>
		</>
	);
}
