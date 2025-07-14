import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mockData, isUsingMockData } from '@/lib/supabase';

// GET /api/admin/social - Lister tous les réseaux sociaux
export async function GET() {
  try {
    if (isUsingMockData()) {
      // Utiliser les données mockées
      return NextResponse.json(mockData.socialMedia);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabaseAdmin
      .from('social_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(mockData.socialMedia);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API admin social:', error);
    return NextResponse.json(mockData.socialMedia);
  }
}

// POST /api/admin/social - Créer un nouveau réseau social
export async function POST(request: NextRequest) {
  try {
    const socialData = await request.json();

    // Validation des données
    const { platform, url, icon } = socialData;

    if (!platform || !url || !icon) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      // En mode démo, simuler la création
      const newSocial = {
        id: Date.now().toString(),
        platform,
        url,
        icon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        social: newSocial,
        message: 'Réseau social créé avec succès (mode démo)'
      });
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabaseAdmin
      .from('social_media')
      .insert({
        platform,
        url,
        icon
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création réseau social:', error);
      return NextResponse.json(
        { error: 'Erreur création réseau social' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      social: data,
      message: 'Réseau social créé avec succès'
    });

  } catch (error) {
    console.error('Erreur création réseau social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}