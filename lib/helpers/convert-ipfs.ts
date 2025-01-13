import { ipfsUrl } from "@/lib/constants";

export const convertIpfsUrl = (url: string) => {
	return url.replace("ipfs://", ipfsUrl);
};
