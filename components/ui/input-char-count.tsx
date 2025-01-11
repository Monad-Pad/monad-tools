import React, { useState } from "react";
import { Input, InputProps } from "@/components/ui/input";

interface WithCharCountProps {
	maxLength: number;
	minLength: number;
}

type InputWithCharCountProps = Omit<InputProps, 'maxLength'> & WithCharCountProps;

export function InputWithCharCount({ maxLength, minLength, className, onChange, ...props }: InputWithCharCountProps) {
	const [charCount, setCharCount] = useState(0);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCharCount(e.target.value.length);
		if (onChange) {
			onChange(e);
		}
	};

	return (
		<div className="relative">
			<Input className={`pr-16 ${className}`} maxLength={maxLength} minLength={minLength} onChange={handleChange} {...props} />
			<div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
				{charCount}/{maxLength}
			</div>
		</div>
	);
}
