import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: { username: string; [key: string]: any } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (user: { username: string; [key: string]: any }) => void;
  logoutContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<{ username: string; [key: string]: any } | null>(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = (userData: { username: string; [key: string]: any }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu vào localStorage
  };

  const logoutContext = () => {
    setUser(null);
    localStorage.removeItem("user"); // Xóa khỏi localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


interface LoadingContextProps {
  isLoadingPage: boolean;
  setLoadingPage: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps>({
  isLoadingPage: false,
  setLoadingPage: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoadingPage, setIsLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoadingPage, setLoadingPage: setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};