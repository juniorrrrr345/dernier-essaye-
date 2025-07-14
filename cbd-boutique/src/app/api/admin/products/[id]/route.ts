import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/products/[id] - Récupérer un produit spécifique
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Erreur récupération produit:', error);
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: data });

  } catch (error) {
    console.error('Erreur API produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const productData = await request.json();
    const { name, description, price, video_url, thumbnail_url, order_link, is_active } = productData;

    // Validation des données
    if (!name || !description || price === undefined || !video_url || !thumbnail_url || !order_link) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        video_url,
        thumbnail_url,
        order_link,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour produit:', error);
      return NextResponse.json(
        { error: 'Erreur mise à jour produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur suppression produit:', error);
      return NextResponse.json(
        { error: 'Erreur suppression produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}