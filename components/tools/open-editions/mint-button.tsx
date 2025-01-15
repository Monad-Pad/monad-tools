"use client";

import { Button } from "@/components/ui/button";
import useOpenEditions from "@/hooks/use-open-editions";
import Image from "next/image";
import { useEffect, useState } from "react";

export function MintButton({ setJustMinted, collectionAddress, mintedTokens, data, isMinting }: { setJustMinted: (value: boolean) => void, collectionAddress: `0x${string}`, mintedTokens: number, data: any, isMinting: boolean }) {
    const { mintOpenEdition } = useOpenEditions();
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (mintedTokens >= data.supply) {
            setIsDisabled(true);
        }
    }, [mintedTokens, data.supply]);

    useEffect(() => {
        if (!isMinting) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [isMinting]);

    const handleMint = async () => {
        const result = (await mintOpenEdition(collectionAddress, 1, data.price)).unwrap();
        if (await result) {
            setJustMinted(true);
        }
    }

    return (
        <Button onClick={handleMint} disabled={isDisabled}>Mint 1 '{data.name}' for {data.price} DMON</Button>
    )
}