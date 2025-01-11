import { supabaseServer } from "@/lib/clients/supabase";
import { notFound } from "next/navigation";

export default async function MintPage({ params }: { params: { slug: string } }) {
    const { data, error } = await supabaseServer.from("nft_collections").select("*").eq("slug", params.slug).maybeSingle();

    if (error) {
        return notFound();
    }

    if (!data) {
        return notFound();
    }

    return (
        <div>
            <h1>{data.name}</h1>
        </div>
    )
}