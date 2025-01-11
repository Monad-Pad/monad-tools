import { type Chain } from "viem";

export const monadDevnet = {
	id: 20143,
	name: "Monad Devnet",
	nativeCurrency: { name: "DMON", symbol: "DMON", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a"] },
	},
	blockExplorers: {
		default: { name: "Blockscout", url: "https://explorer.monad-devnet.devnet101.com/" },
	},
} as const satisfies Chain;
