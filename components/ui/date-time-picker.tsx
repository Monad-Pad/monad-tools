"use client";

import React from "react";
import { format, addMinutes } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useController, Control } from "react-hook-form";
import { TimePicker } from "./time-picker";
import RequiredAsterix from "./required-asterix";

interface DateTimePickerProps {
	name: string;
	control: Control<any>;
	label: string;
}

export function DateTimePicker({ name, control, label }: DateTimePickerProps) {
	const {
		field: { onChange, value },
		fieldState: { error },
	} = useController({
		name,
		control,
		rules: { required: true },
	});

	const now = new Date();
	const minDate = addMinutes(now, 1);

	return (
		<FormItem>
			<FormLabel>
				{label} <RequiredAsterix />
			</FormLabel>
			<Popover>
				<FormControl>
					<PopoverTrigger className={cn(
						"flex h-9 w-full rounded-lg font-medium border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						"justify-start items-center",
						!value && "text-muted-foreground"
					)}>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value ? format(value, "PPP HH:mm:ss") : <span className="text-muted-foreground">Pick a date and time</span>}
					</PopoverTrigger>
				</FormControl>
				<PopoverContent className="w-auto max-w-lg p-0">
					<Calendar
						mode="single"
						selected={value}
						onSelect={onChange}
						initialFocus
						disabled={(date) => date < minDate}
					/>
					<div className="p-3 border-t border-border">
						<TimePicker
							setDate={onChange}
							date={value}
						/>
					</div>
				</PopoverContent>
			</Popover>
			{error && <span className="text-red-500 text-sm">{error.message}</span>}
		</FormItem>
	);
}
