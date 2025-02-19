import { defineChain, type Chain } from "viem";

export const monadTestnet = defineChain({
	id: 10143,
	name: "Monad Testnet",
	nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://monad-testnet.g.alchemy.com/v2/-lZZZdg3VdeAq6Cj4cOEJ3sjeq2YbkL9"] },
	},
	blockExplorers: {
		default: { name: "Explorer", url: "https://testnet.monadexplorer.com" },
	},
});