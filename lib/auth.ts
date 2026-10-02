import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'neoluxe-super-secret-cryptographic-jwt-key-2026';

export interface UserTokenPayload {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export function signUserToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch (err) {
    return null;
  }
}
