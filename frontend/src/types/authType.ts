import { User } from "./userType";

// Données d'inscription
export interface RegisterCredentials {
    username: string;
    identifier_name: string;
    email: string;
    password: string;
}

// Données de connexion
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // Réponse de l'API après authentification
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
  }
  
  // Réponse complète incluant l'utilisateur
  export interface AuthResponseWithUser extends AuthResponse {
    user: User;
  }
  
  // Type pour le refresh token
  export interface RefreshTokenRequest {
    token: string;
  }