import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mockData, isUsingMockData } from '@/lib/supabase';

// GET /api/products/category/[slug] - Récupérer les produits d'une catégorie
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (isUsingMockData()) {
      // Filtrer les produits mockés par catégorie
      const categoryProducts = mockData.products.filter(product => 
        product.category_slug === slug
      );
      
      return NextResponse.json(categoryProducts);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category_slug', slug)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erreur API produits par catégorie:', error);
    return NextResponse.json([]);
  }
}