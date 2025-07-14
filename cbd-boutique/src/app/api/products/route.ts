import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/products - Récupérer tous les produits actifs (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération produits publics:', error);
      return NextResponse.json(
        { error: 'Erreur récupération produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      products: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Erreur API produits publics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}