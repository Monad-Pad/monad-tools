/**
 * Formats a date in Postgres format to a more readable format.
 * 
 * @param {string} date - The date in Postgres format.
 * @returns {string} The formatted date.
 */
export function formatPostgresDate(date: string): string {
    const parsedDate = new Date(date);

    // Format the date as desired (e.g., "August 20, 2024")
    return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}