import React, { createContext, useState } from 'react';

const MyContext = createContext(null);

const MyContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

    const [isNewFilmRented, setIsNewFilmRented] = useState(false);

    const login = (userData) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    const newFilmRented = () => {
        setIsNewFilmRented(true);
    };

    const resetNewFilmRented = () => {
        setIsNewFilmRented(false);
    }

    return (
        <MyContext.Provider value={{ user, login, logout, newFilmRented, resetNewFilmRented, isNewFilmRented }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyContextProvider };
