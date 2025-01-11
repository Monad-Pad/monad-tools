import { FormCreateOpenEditionsBase } from "@/components/forms/tools/open-editions/base";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
	title: "Create a token | Monad Pad",
	description: "Create a token to be used on the Monad Pad platform.",
};

export default function CreateTokenPage() {
	return (
		<div className="w-full flex flex-1 flex-col items-center justify-center">
			<div className="max-w-screen-sm w-full px-6 lg:px-8 py-8">
				<div className="space-y-1.5">
					<Badge variant="outline">Token</Badge>
					<h1 className="text-xl md:text-lg font-bold">Create a token</h1>
					<p className="text-base md:text-sm font-medium text-muted-foreground">Create a token to be used on the Monad Pad platform.</p>
				</div>
				<Separator className="mt-6 mb-5" />
				<FormCreateOpenEditionsBase />
			</div>
		</div>
	);
}
