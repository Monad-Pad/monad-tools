import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabaseServer } from "@/lib/clients/supabase";
import { convertIpfsUrl } from "@/lib/helpers/convert-ipfs";
import { formatAddress } from "@/lib/helpers/formatters/format-address";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Mint NFTs | Monad Tools",
	description: "Mint NFTs on Monad.tools",
};

export default async function MintPage() {
	const { data: nftCollections } = await supabaseServer.from("nft_collections").select("*").order("starts_at", { ascending: false });

	const now = new Date().getTime();

	return (
		<div className="w-full min-h-screen flex flex-1 flex-col items-center">
			<div className="max-w-screen-xl w-full px-6 lg:px-8 py-8 lg:py-20">
				<div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-8">
					<div className="space-y-0.5">
						<h1 className="text-2xl font-bold">All NFT Collections</h1>
						<p className="text-base font-medium text-muted-foreground">Browse through all the NFT collections created by the community.</p>
					</div>
					<Link href="/tools/open-editions" className={buttonVariants({ variant: "outline", size: "sm" })}>
						Create your own
					</Link>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{nftCollections && nftCollections.length > 0 ? (
						nftCollections.map((c) => {
							const startDate = new Date(c.starts_at).getTime();
							const endDate = new Date(c.ends_at).getTime();
							
							const isMinting = startDate <= now && endDate > now;
							const isNotPastEndTime = endDate > now;

							return (
								<Link href={`/mint/${c.slug}`} key={c.id} className="hover:scale-105 transition-all duration-300">
									<div className="w-full aspect-square flex items-center justify-center">
										<Image
											src={convertIpfsUrl(c.data.image)}
											alt={c.data.name}
											width={300}
											height={300}
											className="rounded-xl object-contain h-full w-full"
										/>
									</div>
									<div className="flex flex-col mt-3">
										<h2 className="text-lg font-bold text-foreground">{c.data.name}</h2>
										<p className="text-sm font-medium text-muted-foreground line-clamp-3">{c.data.description}</p>
										<div className="flex flex-wrap gap-1.5 items-center justify-between">
											<p className="text-sm font-semibold text-foreground mt-1.5">Supply: {c.data.supply}</p>
											<Badge size="sm" variant={isMinting ? "default" : !isNotPastEndTime ? "destructive" : "outline"}>
												{isMinting ? "Minting" : !isNotPastEndTime ? "Ended" : "Upcoming"}
											</Badge>
										</div>
										<Separator className="my-2" />
										<div>
											<p className="text-sm text-muted-foreground font-medium">
												Created by{" "}
												<Link
													href={`https://explorer.monad-devnet.devnet101.com/address/${c.creator_address}`}
													target="_blank"
													className="text-primary underline"
												>
													{formatAddress(c.creator_address)}
												</Link>
												.
											</p>
										</div>
									</div>
								</Link>
							);
						})
					) : (
						<p className="font-medium text-muted-foreground">No collections found</p>
					)}
				</div>
			</div>
		</div>
	);
}
