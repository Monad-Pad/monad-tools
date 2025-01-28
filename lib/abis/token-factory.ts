export const tokenFactoryAbi = [
	{
		type: "function",
		name: "createToken",
		inputs: [
			{
				name: "name",
				type: "string",
				internalType: "string",
			},
			{
				name: "symbol",
				type: "string",
				internalType: "string",
			},
			{
				name: "maxSupply",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "TokenCreated",
		inputs: [
			{
				name: "tokenAddress",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "name",
				type: "string",
				indexed: false,
				internalType: "string",
			},
			{
				name: "symbol",
				type: "string",
				indexed: false,
				internalType: "string",
			},
			{
				name: "maxSupply",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
];
