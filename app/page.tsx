import { LinkCard } from "@/components/ui/link-card";
import { tools } from "@/lib/tools";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<div className="flex flex-col items-center justify-center mb-8">
				<h1 className="text-xl font-bold">Tools ({tools.length})</h1>
				<p className="text-base font-medium text-muted-foreground">Tools to explore & engage with Monad Devnet</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				{tools.map((tool) => (
					<LinkCard key={tool.name} title={tool.name} description={tool.description} href={tool.href} icon={tool.icon} disabled={tool.disabled} />
				))}
			</div>
		</div>
	);
}
