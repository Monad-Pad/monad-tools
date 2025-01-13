import { supabaseServer } from "../clients/supabase.server";
import { database } from "../links";

/**
 * Uploads an image to Supabase storage.
 * 
 * @param {File} image - The image file to upload.
 * @param {string} name - The name of the image.
 * @param {string} bucket - The name of the bucket to upload the image to.
 * @param {string} [folder] - An optional folder to store the image in.
 * @returns {Promise<string | null>} The URL of the uploaded image, or null if the upload failed.
 */
export async function uploadImageToSupabase(image: File, name: string, bucket: string, folder?: string): Promise<string | null> {
	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const { data: uploadData, error: uploadError } = await supabaseServer().storage.from(bucket).upload(`${folder ? `${folder}/` : ''}${name}.png`, buffer, {
		contentType: image.type,
		upsert: true,
	});

	if (uploadError) {
		console.log(uploadError);
		return null;
	}

	return `${database.storage.public}/${uploadData?.fullPath}` || null;
}
