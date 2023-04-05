import { useCallback, useEffect, useRef, useState } from "react";

const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]); // stores data across re render cycles

    const sendRequest = useCallback(
        async (url, method = "GET", body = null, headers = {}) => {
            setIsLoading(true);

            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);
            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body,
                    signal: httpAbortCtrl.signal,
                });
                const responseData = await response.json();
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortCtrl
                );

                if (!response.ok) {
                    setIsLoading(false);
                    setError(responseData.message);
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                return responseData;
            } catch (err) {
                //THIS IS WHAT YOU SHOULD ADD
                if (!err.message === "The user aborted a request.") {
                    setError(err.message);
                    setIsLoading(false);
                    throw err;
                }
            }
        },
        []
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach((abortCtrl) =>
                abortCtrl.abort()
            );
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};

export default useHttpClient;
