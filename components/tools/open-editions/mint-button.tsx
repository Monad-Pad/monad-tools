"use client";

import { Button } from "@/components/ui/button";
import useOpenEditions from "@/hooks/use-open-editions";
import Image from "next/image";
import { useEffect, useState } from "react";

export function MintButton({ collectionAddress, mintedTokens, data, isMinting }: { collectionAddress: `0x${string}`, mintedTokens: number, data: any, isMinting: boolean }) {
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

    return (
        <Button onClick={() => mintOpenEdition(collectionAddress, 1)} disabled={isDisabled}>Mint 1 '{data.name}' for {data.price} DMON</Button>
    )
}