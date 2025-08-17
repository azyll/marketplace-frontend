import React, { createContext, useEffect, useState } from "react";
import { IAuthContext } from "@/types/auth.type";
import { IUser } from "@/types/user.type";
import { getLoggedInUser } from "@/services/user.service";

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: (user: IUser | null) => {},
  logout: () => {},
  fetchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  const handleOnSetUser = (user: IUser | null) => {
    setUser(user);
  };

  const handleOnLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const response = await getLoggedInUser();
      handleOnSetUser(response.data);
    } catch (err) {}
  };

  // For retaining user data even on website reload
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleOnSetUser,
        logout: handleOnLogout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
