import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isUsingMockData } from '@/lib/supabase';

// PUT /api/admin/social/[id] - Mettre à jour un réseau social
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const socialData = await request.json();
    const { platform, url, icon } = socialData;

    // Validation des données
    if (!platform || !url || !icon) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      // En mode démo, simuler la mise à jour
      const updatedSocial = {
        id: params.id,
        platform,
        url,
        icon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        social: updatedSocial,
        message: 'Réseau social mis à jour avec succès (mode démo)'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('social_media')
      .update({
        platform,
        url,
        icon,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour réseau social:', error);
      return NextResponse.json(
        { error: 'Erreur mise à jour réseau social' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      social: data,
      message: 'Réseau social mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour réseau social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/social/[id] - Supprimer un réseau social
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    if (isUsingMockData()) {
      // En mode démo, simuler la suppression
      return NextResponse.json({
        success: true,
        message: 'Réseau social supprimé avec succès (mode démo)'
      });
    }

    const { error } = await supabaseAdmin
      .from('social_media')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur suppression réseau social:', error);
      return NextResponse.json(
        { error: 'Erreur suppression réseau social' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Réseau social supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression réseau social:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}