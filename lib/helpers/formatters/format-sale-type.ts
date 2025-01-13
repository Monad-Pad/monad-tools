/**
 * Formats the sale type into a more readable format.
 * 
 * @param {string} saleType - The sale type to format.
 * @returns {string} The formatted sale type.
 */
export function formatSaleType(saleType: string): string {
    switch (saleType) {
        case "fairlaunch":
            return "Fair Launch";
        case "pre-sale":
            return "pre-sale";
        default:
            return saleType;
    }
}