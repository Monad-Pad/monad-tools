import { defineChain, type Chain } from "viem";

export const monadTestnet = defineChain({
	id: 10143,
	name: "Monad Testnet",
	nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://testnet-rpc.monadpad.xyz/ac8a2601c3e93b4a8186126716c8d858043f08c0"] },
	},
	blockExplorers: {
		default: { name: "Explorer", url: "https://testnet.monadexplorer.com" },
	},
});