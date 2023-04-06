import { useCallback, useEffect, useState } from "react";

let logoutTimer;

const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((uid, token, name, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setName(name);

        //new date for first time login
        //expirationDate for all subsequent refreshes of the browser and to still keep user logged in
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString(),
                name:name,
            })
        );
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        if (token) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                storedData.name,
                new Date(storedData.expiration)
            );
        }
    }, [login, name]);

    return { token, login, logout, userId ,name};
};

export default useAuth;
