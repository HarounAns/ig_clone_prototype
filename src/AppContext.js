import React, { useState } from "react";

export const AppContext = React.createContext();

export const AppProvider = ({
    children
}) => {
    const [notifications, setNotification] = useState([]);

    return (
        <AppContext.Provider
            value={{
                notifications,
                setNotification
            }}
        >
            {children}
        </AppContext.Provider>
    );
}