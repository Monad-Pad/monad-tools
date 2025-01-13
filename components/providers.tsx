"use client";

import { config } from "@/lib/clients/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ThemeProvider } from "./theme-provider";
import { AccountProvider } from "./user-context";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider>
						<AccountProvider>
							<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
								{children}
							</ThemeProvider>
						</AccountProvider>
					</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
	);
}
