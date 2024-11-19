import React, { createContext, useState, useEffect } from 'react';

const MyContext = createContext(null);

const MyContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

    const login = (userData) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <MyContext.Provider value={{ user, login, logout }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyContextProvider };