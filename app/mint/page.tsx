import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabaseServer } from "@/lib/clients/supabase";
import { convertIpfsUrl } from "@/lib/helpers/convert-ipfs";
import { formatAddress } from "@/lib/helpers/formatters/format-address";
import Image from "next/image";
import Link from "next/link";

export default async function MintPage() {
	const { data: nftCollections } = await supabaseServer.from("nft_collections").select("*");

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
							const isMinting = c.data.startTime <= Math.floor(Date.now() / 1000) && c.data.endTime > Math.floor(Date.now() / 1000);
							const isEnded = c.data.endTime < Math.floor(Date.now() / 1000);
							return (
								<div key={c.id}>
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
										<div className="flex flex-wrap gap-1.5 justify-between">
											<p className="text-sm font-semibold text-foreground mt-1.5">Supply: {c.data.supply}</p>
											<Badge variant={isMinting ? "default" : isEnded ? "destructive" : "outline"}>
												{isMinting ? "Minting" : isEnded ? "Ended" : "Upcoming"}
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
											</p>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<p>No collections found</p>
					)}
				</div>
			</div>
		</div>
	);
}
