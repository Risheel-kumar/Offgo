import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { storage } from '../utils/storage';
import { authService, LoginCredentials, RegisterUserData } from '../services/authService';
import { setupInterceptors } from '../api/interceptors';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  role: Role | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  switchRole: (newRole: Role) => void;
  updateUser: (partialUser: Partial<User>) => void;
  testConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'offgo_auth_user';
const AUTH_TOKEN_KEY = 'offgo_auth_token';

const normalizeUser = (incomingUser: Partial<User> | null | undefined): User | null => {
  if (!incomingUser) return null;

  const firstName = (incomingUser as any).firstName ?? incomingUser.name?.split(' ')[0] ?? '';
  const lastName = (incomingUser as any).lastName ?? incomingUser.name?.split(' ').slice(1).join(' ') ?? '';
  const fullName = `${firstName} ${lastName}`.trim() || incomingUser.name || 'Off-Go User';

  return {
    ...incomingUser,
    name: fullName,
    firstName,
    lastName,
    phone: incomingUser.phone || (incomingUser as any).phoneNumber || '',
    department: incomingUser.department || '',
    employeeId: incomingUser.employeeId || '',
    status: incomingUser.status || 'ACTIVE',
    createdAt: incomingUser.createdAt || new Date().toISOString(),
  } as User;
};

// Default mock initial user for enterprise SaaS preview

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return normalizeUser(storage.get<User | null>(AUTH_USER_KEY, null));
  });

  const [token, setToken] = useState<string | null>(() => {
    return storage.get<string | null>(AUTH_TOKEN_KEY, null);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const hydrateUserFromBackend = async () => {
      if (!token || user) return;

      try {
        const profile = await authService.getCurrentUserProfile();
        setUser(normalizeUser(profile));
      } catch {
        setUser(null);
      }
    };

    hydrateUserFromBackend();
  }, [token, user]);

  const logoutCallback = useCallback(async () => {
    setToken(null);
    setUser(null);
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(AUTH_USER_KEY);
  }, []);

  // Set up Axios interceptors on mount
  useEffect(() => {
    setupInterceptors(logoutCallback);
  }, [logoutCallback]);

  // Persist user & token updates
  useEffect(() => {
    if (user) {
      storage.set(AUTH_USER_KEY, user);
    } else {
      storage.remove(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      storage.set(AUTH_TOKEN_KEY, token);
    } else {
      storage.remove(AUTH_TOKEN_KEY);
    }
  }, [token]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      const normalizedUser = normalizeUser(response.user);
      setUser(normalizedUser);
      return normalizedUser as User;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterUserData): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      await logoutCallback();
      setIsLoading(false);
    }
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      const res = await authService.testAuthentication();
      return res.authenticated;
    } catch {
      return false;
    }
  };

  const switchRole = (newRole: Role) => {
    if (!user) return;
    const roleNames: Record<Role, string> = {
      ADMIN: 'Alex Rivera (Fleet Admin)',
      EMPLOYEE: 'Sarah Jenkins (Software Eng)',
      DRIVER: 'Michael Vance (Shuttle Lead)',
      FLEET_MANAGER: 'Marcus Vance (Fleet Manager)',
    };
    const roleEmails: Record<Role, string> = {
      ADMIN: 'alex.rivera@corp-offgo.com',
      EMPLOYEE: 'sarah.j@corp-offgo.com',
      DRIVER: 'm.vance@corp-offgo.com',
      FLEET_MANAGER: 'marcus.f@corp-offgo.com',
    };
    const updatedUser: User = {
      ...user,
      role: newRole,
      name: roleNames[newRole] || user.name,
      email: roleEmails[newRole] || user.email,
    };
    setUser(normalizeUser(updatedUser));
  };

  const updateUser = (partialUser: Partial<User>) => {
    if (!user) return;
    const mergedUser = normalizeUser({ ...user, ...partialUser });
    setUser(mergedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loading: isLoading,
        role: user?.role || null,
        login,
        logout,
        register,
        switchRole,
        updateUser,
        testConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
