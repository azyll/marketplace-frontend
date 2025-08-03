import React, { createContext, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  setUser: () => {},
  setUserData: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<any>(null);
  const [userData, setUserDataState] = useState<any>(null);

  const setUser = (id: string | null, role: string | null) => {
    setUserState(`${id}-${role}`);
  };

  const setUserData = (data: any) => {
    setUserDataState(data);
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
