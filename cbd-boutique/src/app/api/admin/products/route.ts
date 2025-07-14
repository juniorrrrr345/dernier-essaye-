import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/products - Lister tous les produits (admin)
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération produits:', error);
      return NextResponse.json(
        { error: 'Erreur récupération produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data });

  } catch (error) {
    console.error('Erreur API produits:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const productData = await request.json();

    // Validation des données
    const { name, description, price, video_url, thumbnail_url, order_link } = productData;

    if (!name || !description || !price || !video_url || !thumbnail_url || !order_link) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

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