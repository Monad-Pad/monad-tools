import { Sale } from "../../types/sales";

/**
 * Get the slug for a sale
 * @param sale - The sale object
 * @returns The slug for the sale
 */
export function getSlug(sale: Sale) {
    let slug = `/projects/${sale.project_id.slug}`;

    if (sale.project_id.amount_of_sales > 1) {
        slug = `${slug}/${sale.slug}`;
    }

    return slug;
}
