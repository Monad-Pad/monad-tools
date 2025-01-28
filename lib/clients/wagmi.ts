import {  getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "./monad";

const chains = [{
	...monadTestnet,
}];

export const config = getDefaultConfig({
	appName: "Monad Tools",
	projectId: "b4767f70430de20f2a9c70e8ed9f93fc",
	chains: chains as any,
	ssr: true,
});