/**
 * Authentication types for GitHub OAuth
 */

export interface AuthSession {
  user: {
    id: number;
    login: string;
    name: string | null;
    avatar_url: string;
    email: string | null;
  };
  accessToken: string;
  expiresAt: number;
}

export interface AuthUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

