import { AbiItem } from "viem";

export const openEditionFactoryAbi: AbiItem[] = [
	{
		type: "constructor",
		inputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "createOpenEdition",
		inputs: [
			{
				name: "_name",
				type: "string",
				internalType: "string",
			},
			{
				name: "_symbol",
				type: "string",
				internalType: "string",
			},
			{
				name: "_baseURI",
				type: "string",
				internalType: "string",
			},
			{
				name: "_mintPrice",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "_startTime",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "_endTime",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "_maxSupply",
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
		type: "function",
		name: "creatorCollections",
		inputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
			{
				name: "",
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
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getCreatorCollections",
		inputs: [
			{
				name: "_creator",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "address[]",
				internalType: "address[]",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "owner",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "OpenEditionCreated",
		inputs: [
			{
				name: "collectionAddress",
				type: "address",
				indexed: true,
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
				name: "owner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "startTime",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "endTime",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
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
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address",
			},
		],
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address",
			},
		],
	},
];