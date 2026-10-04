import { useState, useEffect, useCallback } from 'react';
export function useAsync(asyncFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);
    const refetch = useCallback(() => setVersion((v) => v + 1), []);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        asyncFn()
            .then((result) => { if (!cancelled) {
            setData(result);
            setLoading(false);
        } })
            .catch((err) => { if (!cancelled) {
            setError(err.message ?? 'Unknown error');
            setLoading(false);
        } });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, version]);
    return { data, loading, error, refetch };
}
