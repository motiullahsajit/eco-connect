import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

async function getUserData() {
  try {
    const userDataString = await SecureStore.getItemAsync("userData");
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

async function clearUserData() {
  try {
    await SecureStore.deleteItemAsync("userData");
  } catch (error) {
    console.error("Failed to clear user data:", error);
  }
}

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUserData = async () => {
      setLoading(true);
      const userData = await getUserData();
      if (userData) {
        setIsLogged(true);
        setUser(userData);
      } else {
        setIsLogged(false);
        setUser(null);
      }
      setLoading(false);
    };

    initializeUserData();
  }, []);

  const logout = async () => {
    await clearUserData();
    setIsLogged(false);
    setUser(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
