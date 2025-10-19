import React, { createContext, useEffect, useState } from "react"
import { IAuthContext } from "@/types/auth.type"
import { IUser } from "@/types/user.type"
import { getLoggedInUser } from "@/services/user.service"

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: (user: IUser | null) => {},
  logout: () => {},
  fetchUser: () => {},
  isLoading: true, // default true since we fetch user on mount
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)

  const handleOnSetUser = (user: IUser | null) => {
    setUser(user)
  }

  const handleOnLogout = () => {
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await getLoggedInUser()
      handleOnSetUser(response.data)
    } catch (err) {
      handleOnSetUser(null)
    } finally {
      setLoading(false)
    }
  }

  // For retaining user data even on website reload
  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleOnSetUser,
        logout: handleOnLogout,
        fetchUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
