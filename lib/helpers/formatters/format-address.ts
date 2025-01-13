/**
 * Formats an Ethereum address by displaying the first 6 and last 4 characters.
 * 
 * @param {string | null | undefined} address - The Ethereum address to format.
 * @returns {string} The formatted address.
 */
export const formatAddress = (address: string | null | undefined): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}