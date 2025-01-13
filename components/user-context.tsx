import { ReactNode, useMemo } from "react";
import { useAccount } from "@/hooks/use-account";
import { createContext, useContext } from "react";

// Create a context for the account info
const AccountContext = createContext<ReturnType<typeof useAccount> | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
	const accountInfo = useAccount();
	const memoizedAccountInfo = useMemo(() => accountInfo, [accountInfo]);
	return <AccountContext.Provider value={memoizedAccountInfo}>{children}</AccountContext.Provider>;
}

export function useAccountContext() {
	const context = useContext(AccountContext);
	if (context === null) {
		throw new Error("useAccountContext must be used within an AccountProvider");
	}
	return context;
}
