// src/types/token.ts
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;    // Issued at timestamp (automatically added by JWT)
  exp?: number;    // Expiration timestamp (automatically added by JWT)
}

// Additional token-related types
export interface RefreshTokenPayload extends TokenPayload {
  tokenVersion: number;  // Used to invalidate all refresh tokens if needed
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  payload: TokenPayload;
  iat: number;
  exp: number;
}