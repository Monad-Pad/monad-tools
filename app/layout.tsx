import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggleDropdown } from "@/components/theme-switcher";
import Providers from "@/components/providers";
import RainbowKitConnectButton from "@/components/ui/connect-button";
import { Wrench } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				<Providers>
					<div>
						<div className="flex justify-between items-center gap-2 w-full px-4 py-3">
							<Link href="/" className="flex items-center gap-1.5">
								<Wrench size={20} />
								<p className="text-base font-bold">Monad Tools</p>
							</Link>
							<div className="flex items-center gap-2">
								<ModeToggleDropdown />
								<RainbowKitConnectButton />
							</div>
						</div>
					</div>
					<div className="lg:-mt-[60px]">{children}</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
