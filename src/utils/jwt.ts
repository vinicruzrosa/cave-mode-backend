import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export function generateToken(payload: string | object | Buffer, expiresIn: string = '7d'): string {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
} 