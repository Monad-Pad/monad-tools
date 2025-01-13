import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextareaWithCharCountProps extends React.ComponentProps<typeof Textarea> {
	maxLength: number;
	minLength: number;
}

export function TextareaWithCharCount({ maxLength, minLength, className, onChange, ...props }: TextareaWithCharCountProps) {
	const [charCount, setCharCount] = useState(0);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCharCount(e.target.value.length);
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<div className="relative">
			<Textarea className={`pr-16 ${className}`} maxLength={maxLength} minLength={minLength} onChange={handleChange} {...props} />
			<div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
				{charCount}/{maxLength}
			</div>
		</div>
	);
}
