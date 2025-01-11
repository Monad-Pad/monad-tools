"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Button } from "@/components/ui/button";
import { Wallet, X } from "lucide-react";

export default function RainbowKitConnectButton() {
	return (
		<ConnectButton.Custom>
			{({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
				const ready = mounted && authenticationStatus !== "loading";
				const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<Button onClick={openConnectModal} type="button">
										<Wallet /> Connect Wallet
									</Button>
								);
							}

							if (chain.unsupported) {
								return (
									<Button onClick={openChainModal} type="button">
										<X /> Wrong network
									</Button>
								);
							}

							return (
								<div style={{ display: "flex", gap: 12 }}>
									{/* <Button svg="none" onClick={openChainModal} style={{ display: "flex", alignItems: "center" }} type="button">
										{chain.hasIcon && (
											<div
												style={{
													background: chain.iconBackground,
													width: 16,
													height: 16,
													borderRadius: 999,
													overflow: "hidden",
													marginRight: 4,
												}}
											>
												{chain.iconUrl && (
													<img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 16, height: 16 }} />
												)}
											</div>
										)}
										{chain.name}
									</Button> */}

									<Button onClick={openAccountModal} type="button">
										{chain.hasIcon && (
											<div
												style={{
													background: chain.iconBackground,
													width: 16,
													height: 16,
													borderRadius: 999,
													overflow: "hidden",
													marginRight: 4,
												}}
											>
												{chain.iconUrl && (
													<img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 16, height: 16 }} />
												)}
											</div>
										)}
										{account.displayName}
										{account.displayBalance ? ` (${account.displayBalance})` : ""}
									</Button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
