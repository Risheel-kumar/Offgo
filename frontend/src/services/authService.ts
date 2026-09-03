import apiClient from '../api/axios';
import { User, Role } from '../types';

interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    role: Role;
    authenticated: boolean;
  };
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  role?: Role;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  getCurrentUserProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    const profile = response.data?.data ?? response.data;

    return {
      id: profile.id,
      name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Off-Go User',
      email: profile.email,
      role: profile.role,
      department: profile.department ?? '',
      employeeId: profile.employeeId ?? '',
      phone: profile.phoneNumber ?? profile.phone ?? '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {

    const response =
        await apiClient.post<BackendLoginResponse>(
            "/auth/login",
            {
                email: credentials.email,
                password: credentials.password
            }
        );

    const data = response.data.data;

    const user: User = {

        id: data.id,

        name: `${data.firstName} ${data.lastName}`,

        email: data.email,

        role: data.role,

        department: data.department ?? "",

        employeeId: data.employeeId ?? "",

        phone: data.phone ?? data.phoneNumber ?? "",

        status: "ACTIVE",

        createdAt: new Date().toISOString()

    };

    return {

        token: data.token,

        user,

        message: response.data.message

    };

},

  register: async (userData: RegisterUserData): Promise<{ message: string; user?: User }> => {
    try {
      const { phone, ...registration } = userData;
      const response = await apiClient.post<any>('/auth/register', {
        ...registration,
        phoneNumber: phone,
      });
      return response.data?.data || response.data;
    } catch (error) {
        throw error;
    }
  },

  testAuthentication: async (): Promise<{ authenticated: boolean; user?: User; status: string }> => {
    try {
      const response = await apiClient.get<{ authenticated: boolean; user?: User; status: string }>('/auth/test');
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        return {
          authenticated: true,
          status: 'Connection OK',
        };
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    }
  },
};
