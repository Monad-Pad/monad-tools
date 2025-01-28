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
import { ArrowLeftIcon } from "lucide-react";
import Confetti from 'react-confetti';
import { EXPLORER_URL } from "@/lib/constants";

export function MintUI({ collectionAddress, data, collection }: { collectionAddress: `0x${string}`; data: any; collection: any }) {
	const { getMintedTokens } = useOpenEditions();
	const [mintedTokens, setMintedTokens] = useState(0);
	const [isMinting, setIsMinting] = useState(false);
	const [isNotPastEndTime, setIsNotPastEndTime] = useState(false);
	const [justMinted, setJustMinted] = useState(false);
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0
	});

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
	}, [collection.starts_at, collection.ends_at]);

	useEffect(() => {
		if (justMinted) {
			setMintedTokens(mintedTokens + 1);
			setTimeout(() => {
				setJustMinted(false);
			}, 2500);
		}
	}, [justMinted]);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const checkTime = () => {
			const now = new Date();
			const startDate = new Date(collection.starts_at);
			
			if (!isMinting && now >= startDate) {
				window.location.reload();
			}
		};

		const interval = setInterval(checkTime, 1000);
		
		return () => clearInterval(interval);
	}, [isMinting, collection.starts_at]);

	return (
<>
			{justMinted && (
				<div className="fixed inset-0 pointer-events-none z-50">
					<Confetti
						width={windowSize.width}
						height={windowSize.height}
						recycle={false}
						numberOfPieces={200}
					/>
				</div>
			)}
			<div className="flex flex-col justify-center gap-1">
				<Link href="/mint" className="text-sm font-medium mb-6 text-primary underline flex items-center gap-1">
					<ArrowLeftIcon size={16} /> Back to overview
				</Link>
				<h1 className="text-2xl md:text-3xl font-bold">
					{data.name} ({data.symbol})
				</h1>
				<p className="text-base md:text-lg text-muted-foreground font-medium">{data.description}</p>
				<Separator className="my-2" />
				<div>
					<p className="text-sm text-muted-foreground font-medium">
						Created by{" "}
						<Link
							href={`${EXPLORER_URL}/address/${collection.creator_address}`}
							target="_blank"
							className="text-primary underline"
						>
							{formatAddress(collection.creator_address)}
						</Link>
						.{" "}
						<span className="text-muted-foreground font-medium">Address:</span>{" "}
						<Link href={`${EXPLORER_URL}/address/${collection.contract_address}`} target="_blank" className="text-primary underline">
							{formatAddress(collection.contract_address)}
						</Link>
					</p>
				</div>
				<div className="flex flex-col gap-2 mt-6">
					<div className="text-sm text-muted-foreground font-medium flex justify-between gap-2 flex-wrap items-center">
						<p>Max per wallet: <span className="text-primary font-semibold">{data.maxPerWallet}</span></p>
						<p>Max per transaction: <span className="text-primary font-semibold">{data.maxPerTx}</span></p>
					</div>
					<MintButton setJustMinted={setJustMinted} collectionAddress={collectionAddress} mintedTokens={mintedTokens} data={data} isMinting={isMinting} />
					<div className="w-full">
						<Progress value={(mintedTokens / data.supply) * 100} max={100} />
						<div className="flex justify-between">
							<p className="text-sm text-muted-foreground font-medium">{mintedTokens}</p>
							<p className="text-sm text-muted-foreground font-medium">{data.supply}</p>
						</div>
					</div>
					{!isMinting && isNotPastEndTime && (
						<div className="w-full lg:w-1/2 mt-4">
							<p className="text-sm uppercase text-muted-foreground font-semibold mb-1">{isMinting ? "Minting ends in" : "Minting starts in"}</p>
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
				<Image
					unoptimized
					src={convertIpfsUrl(data.image)}
					alt={data.name}
					width={512}
					height={512}
					className="w-full aspect-square h-full object-cover rounded-2xl"
				/>
			</div>
		</>
	);
}
