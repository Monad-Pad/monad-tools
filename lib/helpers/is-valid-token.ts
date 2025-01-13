/**
 * Checks if a given token is in a valid Ethereum address format.
 * 
 * @param {string} token - The token to check.
 * @returns {boolean} True if the token is a valid Ethereum address, false otherwise.
 */
export function isValidTokenFormat(token: string): boolean {
	// Regular expression pattern for Ethereum address format
	const pattern = /^0x[a-fA-F0-9]{40}$/;

	// Use test() method to check if the token matches the pattern
	return pattern.test(token);
}