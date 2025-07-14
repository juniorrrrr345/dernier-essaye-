import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mockData, isUsingMockData } from '@/lib/supabase';

// GET /api/admin/categories - Lister toutes les catégories
export async function GET() {
  try {
    if (isUsingMockData()) {
      const mockCategories = [
        {
          id: '1',
          name: 'Huiles CBD',
          slug: 'huiles-cbd',
          description: 'Huiles CBD de différentes concentrations',
          image_url: '/uploads/categories/huiles-cbd.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Gélules CBD',
          slug: 'gelules-cbd',
          description: 'Gélules CBD pour une prise facile',
          image_url: '/uploads/categories/gelules-cbd.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Cosmétiques CBD',
          slug: 'cosmetiques-cbd',
          description: 'Produits cosmétiques enrichis au CBD',
          image_url: '/uploads/categories/cosmetiques-cbd.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return NextResponse.json(mockCategories);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(mockData.categories || []);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API categories:', error);
    return NextResponse.json(mockData.categories || []);
  }
}

// POST /api/admin/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json();

    // Validation des données
    const { name, description, image_url } = categoryData;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Nom et description sont requis' },
        { status: 400 }
      );
    }

    if (isUsingMockData()) {
      const newCategory = {
        id: Date.now().toString(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        image_url: image_url || '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        category: newCategory,
        message: 'Catégorie créée avec succès (mode démo)'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        image_url: image_url || '',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création catégorie:', error);
      return NextResponse.json(
        { error: 'Erreur création catégorie' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category: data,
      message: 'Catégorie créée avec succès'
    });

  } catch (error) {
    console.error('Erreur création catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}