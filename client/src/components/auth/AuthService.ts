import { IUser } from '@/types/app.types';
import api from '../../services/api/axios';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  async handleCallback(token: string): Promise<IUser> {
    localStorage.setItem('token', token);
    const { data: user } = await api.get<IUser>('/auth/user');
    return user;
  }

  async login(): Promise<void> {
    const scope = 'email profile';
    window.location.href = `${
      import.meta.env.VITE_SERVER_URL
    }/auth/google?scope=${encodeURIComponent(scope)}`;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService.getInstance();
