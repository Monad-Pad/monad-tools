"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount as useWagmiAccount, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";

export function useAccount() {
	const { address, status: wagmiStatus } = useWagmiAccount();
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const chainId = useChainId();
	const { signMessageAsync } = useSignMessage();

	const fetchNonce = useCallback(async (): Promise<string | null> => {
		try {
			const response = await fetch("/api/auth/nonce");
			if (!response.ok) throw new Error("Failed to fetch nonce");
			const { nonce } = await response.json();
			return nonce;
		} catch (error) {
			console.error("Error fetching nonce:", error);
			return null;
		}
	}, []);

	const handleSiweAuthentication = useCallback(
		async (userAddress: string): Promise<string | null> => {
			try {
				const nonce = await fetchNonce();
				if (!nonce) throw new Error("Failed to fetch nonce");

				const message = new SiweMessage({
					domain: window.location.host,
					address: userAddress,
					statement: "Sign in to Monad Tools",
					uri: window.location.origin,
					version: "1",
					chainId,
					nonce,
				});

				const signature = await signMessageAsync({
					message: message.prepareMessage(),
				});

				const verifyRes = await fetch("/api/auth/verify", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message, signature }),
				});

				if (!verifyRes.ok) {
					const errorData = await verifyRes.json();
					throw new Error(errorData.error || "Error verifying message");
				}

				const { user: authenticatedUser } = await verifyRes.json();
				return authenticatedUser;
			} catch (error) {
				console.error("SIWE Authentication error:", error);
				return null;
			}
		},
		[chainId, signMessageAsync, fetchNonce]
	);

	const authenticate = useCallback(async () => {
		if (!address || wagmiStatus !== "connected" || isAuthenticating) {
			return;
		}

		try {
			setIsAuthenticating(true);
			const user = await handleSiweAuthentication(address);
			setIsAuthenticated(!!user);
			return user;
		} catch (error) {
			console.error("Authentication error:", error);
			setIsAuthenticated(false);
		} finally {
			setIsAuthenticating(false);
		}
	}, [address, wagmiStatus, isAuthenticating, handleSiweAuthentication]);

	const logout = useCallback(async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Logout error:', error);
		}
	}, []);

	const checkAuthStatus = useCallback(async () => {
		try {
			setIsCheckingAuth(true);
			const response = await fetch('/api/auth/session');
			const { authenticated } = await response.json();
			setIsAuthenticated(authenticated);
		} catch (error) {
			console.error('Error checking auth status:', error);
			setIsAuthenticated(false);
		} finally {
			setIsCheckingAuth(false);
		}
	}, []);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	useEffect(() => {
		if (!isCheckingAuth &&
			wagmiStatus === "connected" && 
			!isAuthenticated && 
			!isAuthenticating && 
			address) {
			authenticate();
		}
	}, [wagmiStatus, isAuthenticated, isAuthenticating, address, authenticate, isCheckingAuth]);

	const isLoading = wagmiStatus === "connecting" || isAuthenticating || isCheckingAuth;

	return {
		address: address || "",
		status: wagmiStatus,
		isLoading,
		isAuthenticated,
		authenticate,
		logout,
	};
}
