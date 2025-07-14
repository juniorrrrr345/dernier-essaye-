import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mockData, isUsingMockData } from '@/lib/supabase';

// GET /api/admin/products - Lister tous les produits (admin)
export async function GET() {
  try {
    if (isUsingMockData()) {
      // Utiliser les données mockées
      return NextResponse.json(mockData.products);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(mockData.products);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API admin products:', error);
    return NextResponse.json(mockData.products);
  }
}

// POST /api/admin/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Validation des données
    const { name, description, price, video_url, thumbnail_url, order_link } = productData;

    if (!name || !description || !price || !video_url || !thumbnail_url || !order_link) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      // En mode démo, simuler la création
      const newProduct = {
        id: Date.now().toString(),
        name,
        description,
        price: parseFloat(price),
        video_url,
        thumbnail_url,
        order_link,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        product: newProduct,
        message: 'Produit créé avec succès (mode démo)'
      });
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        video_url,
        thumbnail_url,
        order_link,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création produit:', error);
      return NextResponse.json(
        { error: 'Erreur création produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
      message: 'Produit créé avec succès'
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}