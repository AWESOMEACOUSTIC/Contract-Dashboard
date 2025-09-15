"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("auth_user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Mock login function
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))
    if (password === "test123") {
      const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const mockUser: User = {
        id: `user_${Date.now()}`,
        username: username,
        email: `${username}`
      }

      setToken(mockToken)
      setUser(mockUser)

      localStorage.setItem("auth_token", mockToken)
      localStorage.setItem("auth_user", JSON.stringify(mockUser))

      setIsLoading(false)
      return { success: true, message: "Login successful!" }
    } else {
      setIsLoading(false)
      return { success: false, message: "Invalid password. Use 'test123' to login." }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}