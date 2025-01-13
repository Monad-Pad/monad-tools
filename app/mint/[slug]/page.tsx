import { supabaseServer } from "@/lib/clients/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MintButton } from "@/components/tools/open-editions/mint-button";
import { MintUI } from "@/components/tools/open-editions/mint-ui";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { data: nftCollection } = await supabaseServer
        .from("nft_collections")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

    if (!nftCollection) {
        return {
            title: 'Collection Not Found',
        };
    }

    const data = nftCollection.data;

    return {
        title: `Mint ${data.name} | Monad Tools`,
        description: data.description || `Mint ${data.name} NFT collection on monad.tools`,
        openGraph: {
            title: `Mint ${data.name} | Monad Tools`,
            description: data.description || `Mint ${data.name} NFT collection on monad.tools`,
            images: data.image ? [data.image] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Mint ${data.name} | Monad Tools`,
            description: data.description || `Mint ${data.name} NFT collection on monad.tools`,
            images: data.image ? [data.image] : [],
        },
    };
}

export default async function MintPage({ params }: { params: { slug: string } }) {
    const { data: nftCollection, error } = await supabaseServer.from("nft_collections").select("*").eq("slug", params.slug).maybeSingle();

    if (error) {
        return notFound();
    }

    if (!nftCollection) {
        return notFound();
    }

    const data = nftCollection.data;

    return (
        <div className="w-full min-h-screen flex flex-1 flex-col items-center justify-center">
			<div className="max-w-screen-lg w-full px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <MintUI collectionAddress={nftCollection.contract_address} data={data} collection={nftCollection} />
            </div>
        </div>
    )
}
