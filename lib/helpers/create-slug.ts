"use server";

import { supabaseServer } from "../clients/supabase";

/**
 * Creates a unique slug for a given name.
 * 
 * @param {string} name - The name to create a slug for.
 * @returns {Promise<string>} The unique slug.
 */
export default async function createSlug(name: string, table: string): Promise<string> {
    // Create a URL-friendly slug
    let slug = name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
        .trim();                  // Trim hyphens from start and end

    // Check if the slug already exists
    const { data, error } = await supabaseServer.from(table).select("slug").eq("slug", slug).maybeSingle();
    
    if (error) {
        throw error;
    }

    // If the slug already exists, append a number
    if (data) {
        let counter = 1;
        let newSlug = slug;
        while (true) {
            newSlug = `${slug}-${counter}`;
            const { data: checkData, error: checkError } = await supabaseServer
                .from(table)
                .select("slug")
                .eq("slug", newSlug)
                .maybeSingle();
            
            if (checkError) {
                throw checkError;
            }

            if (!checkData) {
                slug = newSlug;
                break;
            }
            counter++;
        }
    }

    return slug;
}