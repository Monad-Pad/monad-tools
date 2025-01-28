import { Currency, ImagePlus, LockIcon, LockKeyhole, PackageOpen, PlusCircle, Send } from "lucide-react";

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
        name: "Token Creator",
        description: "Create a fungible token",
        href: "/tools/token-creator",
        icon: <Currency />,
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
        name: "Token Locker",
        description: "Lock tokens and set vesting schedules",
        href: "/tools/token-locker",
        icon: <LockKeyhole />,
        disabled: true
    },
    {
        name: "LP Locker",
        description: "Lock liquidity pool tokens",
        href: "/tools/lp-locker",
        icon: <LockIcon />,
        disabled: true
    },
]