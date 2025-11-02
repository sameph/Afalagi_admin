import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt?: string;
  lastLogin?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API = (import.meta as any).env.VITE_API_URL;

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API}/api/auth/check-auth`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Check if the response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${contentType}`);
      }
      
      const data = await res.json();
      
      if (data && data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    setUser(data.user);
  };

  const logout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
