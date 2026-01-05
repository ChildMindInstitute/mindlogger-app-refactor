// MFA token data persisted during verification flow
export interface MfaTokenData {
  mfaToken: string;
  email: string;
  password: string;
  timestamp: number;
  purpose?: 'login' | 'recovery';
}

// Token status metadata
export interface MfaTokenMetadata {
  exists: boolean;
  isExpired: boolean;
  timeRemaining: number;
}
