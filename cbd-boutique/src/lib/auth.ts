import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuration avec valeurs par défaut
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$uh8OTKJhC9X5A7s5RoD7kuRJtQeb8Qbqimv4q65GK7CXge5NR2ucW';

export interface AdminSession {
  authenticated: boolean;
  expires: string;
}

interface JwtPayload {
  role: string;
  exp: number;
}

// Vérifier le mot de passe admin
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Erreur vérification mot de passe:', error);
    return false;
  }
}

// Générer un token JWT pour l'admin
export function generateAdminToken(): string {
  const payload = {
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Vérifier un token JWT
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.role === 'admin';
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return false;
  }
}

// Créer une session admin
export function createAdminSession(): AdminSession {
  const expires = new Date();
  expires.setHours(expires.getHours() + 24); // 24 heures

  return {
    authenticated: true,
    expires: expires.toISOString()
  };
}

// Vérifier si une session est valide
export function isSessionValid(session: AdminSession): boolean {
  if (!session.authenticated) return false;
  
  const now = new Date();
  const expires = new Date(session.expires);
  
  return now < expires;
}

// Middleware pour vérifier l'authentification
export function requireAuth(req: Request): AdminSession | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  if (verifyAdminToken(token)) {
    return createAdminSession();
  }
  
  return null;
}