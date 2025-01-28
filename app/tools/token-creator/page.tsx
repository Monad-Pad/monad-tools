import { FormCreateTokenBase } from "@/components/forms/tools/token-creator/base";
import { CreatedTokens } from "@/components/tools/token-creator/created-tokens";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
	title: "Create a token | Monad Tools",
	description: "Create a token to be used on the Monad Pad platform.",
};

export default function CreateTokenPage() {
	return (
		<div className="w-full flex flex-1 flex-col items-center justify-start min-h-screen">
			<div className="max-w-screen-sm w-full px-6 lg:px-8 py-8">
				<div className="space-y-1.5">
					<Badge variant="outline">Token</Badge>
					<h1 className="text-xl md:text-lg font-bold">Create a token</h1>
					<p className="text-base md:text-sm font-medium text-muted-foreground">Create a token to be used on Monad Testnet.</p>
				</div>
				<Separator className="mt-6 mb-5" />
				<FormCreateTokenBase />
				<CreatedTokens />
			</div>
		</div>
	);
}
