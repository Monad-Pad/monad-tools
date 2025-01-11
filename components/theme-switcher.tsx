"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, MoonIcon, SunIcon } from "lucide-react";

export function ModeToggleDropdown() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function ModeToggleSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<ToggleGroup className="w-full" type="single" value={theme || "system"} onValueChange={(value) => value && setTheme(value)} defaultValue="system">
			<ToggleGroupItem className="w-1/3" size="sm" value="system" aria-label="System theme">
				<Monitor size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem className="w-1/3" size="sm" value="light" aria-label="Light theme">
				<SunIcon size={16} />
			</ToggleGroupItem>
			<ToggleGroupItem className="w-1/3" size="sm" value="dark" aria-label="Dark theme">
				<MoonIcon size={16} />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
