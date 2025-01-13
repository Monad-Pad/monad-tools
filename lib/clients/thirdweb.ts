import { createThirdwebClient } from "thirdweb";

export const backendClient = createThirdwebClient({ secretKey: process.env.THIRDWEB_SECRET_KEY! });

export const frontendClient = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID! });