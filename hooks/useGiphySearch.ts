import { Gif } from '@/src/types/giphy';
import { useState, useCallback } from 'react';

const API_KEY = 'ROhlODTq4Qesct9drN6cB3VRlgXXt3Vt'; // Replace with your API key
const BASE_URL = 'https://api.giphy.com/v1/gifs';

export const useGiphySearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGifs = useCallback(async (
        endpoint: string,
        params: Record<string, string | number>
    ): Promise<Gif[]> => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                api_key: API_KEY,
                ...params as Record<string, string>
            });

            const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            return data.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, fetchGifs };
};