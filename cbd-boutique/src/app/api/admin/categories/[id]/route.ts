import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isUsingMockData } from '@/lib/supabase';

// DELETE /api/admin/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isUsingMockData()) {
      return NextResponse.json({ 
        success: true, 
        message: 'Catégorie supprimée avec succès (mode démo)' 
      });
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur suppression catégorie:', error);
      return NextResponse.json(
        { error: 'Erreur suppression catégorie' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur API suppression catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}