import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateAdminToken, verifyAdminToken, createAdminSession } from '@/lib/auth';

// POST /api/admin/auth - Login admin
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const session = createAdminSession();

    return NextResponse.json({
      success: true,
      token,
      session,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur authentification:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET /api/admin/auth - Vérifier le token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { authenticated: false, error: 'Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const isValid = verifyAdminToken(token);

    if (!isValid) {
      return NextResponse.json(
        { authenticated: false, error: 'Token invalide' },
        { status: 401 }
      );
    }

    const session = createAdminSession();

    return NextResponse.json({
      authenticated: true,
      session
    });

  } catch (error) {
    console.error('Erreur vérification token:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}