import React from "react";
import { Input } from "@/components/ui/input";
import { formatTokenNumber } from "@/lib/helpers/formatters/format-number";
import { useController, Control } from "react-hook-form";

interface TokenAmountInputProps {
	name: string;
	control: Control<any>;
	placeholder: string;
	tokenSymbol?: string;
}

export function TokenAmountInput({ name, control, placeholder, tokenSymbol, ...props }: TokenAmountInputProps) {
	const {
		field: { onChange, value },
		fieldState: { error }
	} = useController({
		name,
		control,
		rules: { required: true }
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		// Allow numbers, a single decimal point, and commas for thousands
		const sanitizedValue = inputValue.replace(/[^0-9.,]/g, '')
			.replace(/(\..*)\./g, '$1')
			.replace(/,/g, '');
		
		// Keep as string to preserve leading zeros and decimal points
		onChange(sanitizedValue);
	};

	// Format the display value with commas for thousands, preserving decimal part
	const formatDisplayValue = (val: string): string => {
		const parts = val.split('.');
		const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
	};

	const displayValue = typeof value === 'string' ? formatDisplayValue(value) : '';

	// const formattedValue = value && parseFloat(value) !== 0 ? formatTokenNumber(parseFloat(value)) : '';

	return (
		<div className="relative">
			<Input
				type="text"
				inputMode="decimal"
				placeholder={placeholder}
				value={displayValue}
				onChange={handleInputChange}
				{...props}
			/>
			{displayValue && tokenSymbol && (
					<span className="text-xs font-semibold absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
						{displayValue} {tokenSymbol}
					</span>
				)}
		</div>
	);
}
