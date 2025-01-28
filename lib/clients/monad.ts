import { defineChain, type Chain } from "viem";

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

export const monadTestnet = defineChain({
	id: 10143,
	name: "Monad Testnet",
	nativeCurrency: { name: "TMON", symbol: "TMON", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6"] },
	},
	blockExplorers: {
		default: { name: "Explorer", url: "https://testnet.monadexplorer.com" },
	},
});