import { NextResponse } from 'next/server';
import { supabase, mockData, isUsingMockData } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (isUsingMockData()) {
      // Utiliser les données mockées
      const product = mockData.products.find(p => p.id === id);
      if (!product) {
        return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}