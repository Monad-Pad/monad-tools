/**
 * Formats a number into a more readable format.
 * 
 * @param {number} value - The number to format.
 * @param {Object} [options] - Optional formatting options.
 * @param {number} [options.minimumFractionDigits=0] - The minimum number of digits after the decimal point.
 * @param {number} [options.maximumFractionDigits=0] - The maximum number of digits after the decimal point.
 * @param {boolean} [options.abbreviated=false] - Whether to format the number with k, M, B suffixes.
 * @returns {string} The formatted number.
 */
export function formatTokenNumber(value: number, options?: {
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	abbreviated?: boolean;
}): string {
	const defaultOptions = {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
		abbreviated: false,
	};

	const formatterOptions = {
		...defaultOptions,
		...options,
	};

	if (formatterOptions.abbreviated) {
		const abbreviations = [
			{ value: 1e9, symbol: 'B' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e3, symbol: 'k' },
		];

		for (const { value: divisor, symbol } of abbreviations) {
			if (Math.abs(value) >= divisor) {
				const divided = value / divisor;
				const hasDecimals = divided % 1 !== 0;
				return new Intl.NumberFormat('en-US', {
					minimumFractionDigits: hasDecimals ? 2 : 0,
					maximumFractionDigits: hasDecimals ? 2 : 0,
				}).format(divided) + symbol;
			}
		}
	}

	return new Intl.NumberFormat("en-US", formatterOptions).format(value);
}
