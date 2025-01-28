import useSWR from 'swr';
import { DbToken } from "@/types/tokens";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePortfolio() {
	const { data, error, mutate }: { data: {success: boolean, data: DbToken[]}, error: any, mutate: any } = useSWR('/api/portfolio', fetcher);

	return {
		tokens: data?.data || [],
		fetchTokens: mutate,
		isLoading: !error && !data,
		isError: error
	};
}
