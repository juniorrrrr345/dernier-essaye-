import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/products/[id] - Récupérer un produit spécifique (public)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Erreur récupération produit public:', error);
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: data });

  } catch (error) {
    console.error('Erreur API produit public:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}