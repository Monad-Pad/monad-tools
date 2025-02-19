import { FormCreateOpenEditionsBase } from "@/components/forms/tools/open-editions/base";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
	title: "Create an Open Edition NFT | Monad Tools",
	description: "Create an Open Edition NFT to be minted on Monad Testnet v2.",
};

export default function CreateOpenEditionsPage() {
	return (
		<div className="w-full flex flex-1 flex-col items-center justify-center">
			<div className="max-w-screen-sm w-full px-6 lg:px-8 py-8">
				<div className="space-y-1.5">
					<Badge variant="outline">Open Editions</Badge>
					<h1 className="text-xl md:text-lg font-bold">Create an Open Edition NFT</h1>
					<p className="text-base md:text-sm font-medium text-muted-foreground">Create an Open Edition NFT to be minted on Monad Testnet v2.</p>
				</div>
				<p className="text-sm text-muted-foreground font-medium mt-4">PS: You can only upload 1 image every 5 minutes.</p>
				<Separator className="mt-6 mb-5" />
				<FormCreateOpenEditionsBase />
			</div>
		</div>
	);
}
