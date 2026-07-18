const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'recruiter' | 'candidate';
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: 'recruiter' | 'candidate';
      company?: string;
      createdAt: string;
      lastLogin?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  errors?: Array<{ field: string; message: string }>;
}

class AuthAPI {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse(response);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async getMe(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async verifyToken(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<AuthResponse>(response);
  }
}

export const authAPI = new AuthAPI();
