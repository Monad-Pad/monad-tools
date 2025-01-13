import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = async (file: File, saleId: string) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("saleId", saleId);

	const response = await fetch("/api/sales/upload", {
		method: "POST",
		headers: {
			"x-vercel-filename": file?.name || "image.png",
		},
		body: formData,
	});

	if (!response.ok) {
		throw new Error("Upload failed");
	}

	const data = await response.json();
	return data;
};

export function uploadTiptapImage(saleId: string) {
	return createImageUpload({
		onUpload: (file: File) => onUpload(file, saleId),
		validateFn: (file) => {
			if (!file.type.includes("image/")) {
				toast.error("File type not supported.");
				return false;
			} else if (file.size / 1024 / 1024 > 20) {
				toast.error("File size too big (max 20MB).");
				return false;
			}
			return true;
		},
	});
}
