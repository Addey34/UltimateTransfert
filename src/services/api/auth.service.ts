import { IUser } from '@/types/user';
import api from '../../api/axios';

export class AuthService {
  private static instance: AuthService;

  // Singleton pour obtenir l'instance du service
  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  // Gère le callback après l'authentification
  async handleCallback(token: string): Promise<IUser> {
    localStorage.setItem('token', token);
    const { data: user } = await api.get<IUser>('/auth/user');
    return user;
  }

  // Redirige l'utilisateur vers la page de login
  async login(): Promise<void> {
    const scope = 'email profile';
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google?scope=${encodeURIComponent(scope)}`;
  }

  // Déconnecte l'utilisateur
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  // Récupère le token d'authentification
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService.getInstance();
