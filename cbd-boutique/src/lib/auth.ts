import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminSession } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Vérifier le mot de passe admin
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    if (!ADMIN_PASSWORD_HASH) {
      console.error('ADMIN_PASSWORD_HASH non configuré');
      return false;
    }
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Erreur vérification mot de passe:', error);
    return false;
  }
}

// Générer un token JWT pour l'admin
export function generateAdminToken(): string {
  const payload = {
    admin: true,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };
  return jwt.sign(payload, JWT_SECRET);
}

// Vérifier un token JWT
export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { admin: boolean; exp: number };
    if (decoded.admin) {
      return {
        authenticated: true,
        expires: new Date(decoded.exp * 1000).toISOString()
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Hasher un mot de passe (utilitaire pour générer le hash initial)
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Middleware pour vérifier l'authentification
export function requireAuth(req: Request): AdminSession | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyAdminToken(token);
}