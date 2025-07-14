import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/config - Récupérer la configuration de la boutique
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('shop_config')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur récupération config:', error);
      return NextResponse.json(
        { error: 'Erreur récupération configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ config: data });

  } catch (error) {
    console.error('Erreur API config:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/config - Mettre à jour la configuration
export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const configData = await request.json();
    const { 
      shop_name, 
      background_color, 
      background_image_url, 
      logo_url,
      dark_mode, 
      footer_text 
    } = configData;

    // Validation des données
    if (!shop_name || !background_color || footer_text === undefined) {
      return NextResponse.json(
        { error: 'Les champs shop_name, background_color et footer_text sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si une configuration existe déjà
    const { data: existingConfig } = await supabaseAdmin
      .from('shop_config')
      .select('id')
      .single();

    let result;

    if (existingConfig) {
      // Mettre à jour la configuration existante
      const { data, error } = await supabaseAdmin
        .from('shop_config')
        .update({
          shop_name,
          background_color,
          background_image_url: background_image_url || null,
          logo_url: logo_url || null,
          dark_mode: dark_mode || false,
          footer_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConfig.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Créer une nouvelle configuration
      const { data, error } = await supabaseAdmin
        .from('shop_config')
        .insert({
          shop_name,
          background_color,
          background_image_url: background_image_url || null,
          logo_url: logo_url || null,
          dark_mode: dark_mode || false,
          footer_text
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Erreur mise à jour config:', result.error);
      return NextResponse.json(
        { error: 'Erreur mise à jour configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config: result.data,
      message: 'Configuration mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour config:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}