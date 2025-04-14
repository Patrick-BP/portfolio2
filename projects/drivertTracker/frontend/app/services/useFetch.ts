
import { useEffect, useState } from 'react';

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => { 
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
        const result = await fetchFunction();
        setData(result);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
        setLoading(false);
        }
    };
    const reset = () => {
        setData(null);
        setLoading(true);
        setError(null);
    }
    
    useEffect(() => {
        if (autoFetch) {
        fetchData();
        }
    }, [autoFetch]);
    
    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;