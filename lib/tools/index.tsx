import { ImagePlus, PackageOpen, PlusCircle, Send } from "lucide-react";

interface Tool {
    name: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

export const tools: Tool[] = [
    {
        name: "Open Edition NFTs",
        description: "Create an open edition mint page for your NFT collection",
        href: "/tools/open-editions",
        icon: <PackageOpen />
    },
    {
        name: "NFT Minter",
        description: "Create an NFT mint page for your NFT collection",
        href: "/tools/nft-minter",
        icon: <ImagePlus />,
        disabled: true
    },
    {
        name: "Multisender",
        description: "Send tokens or DMON to multiple addresses at once",
        href: "/tools/multisender",
        icon: <Send />,
        disabled: true
    },
    {
        name: "Token Creator",
        description: "Create a fungible token",
        href: "/tools/token-creator",
        icon: <Send />,
        disabled: true
    },
]