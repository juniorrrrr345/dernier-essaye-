import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isUsingMockData } from '@/lib/supabase';

// GET /api/admin/content - Récupérer tout le contenu
export async function GET() {
  try {
    if (isUsingMockData()) {
      // Données mockées pour le contenu
      const mockContent = {
        pages: [
          {
            id: '1',
            page_key: 'about',
            content: {
              title: 'À propos de nous',
              content: 'Nous sommes spécialisés dans la vente de produits CBD de qualité...',
              slug: 'a-propos',
              published: true
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            page_key: 'contact',
            content: {
              title: 'Contact',
              content: 'Pour nous contacter :\nEmail: contact@maboutiquecbd.fr\nTéléphone: 01 23 45 67 89',
              slug: 'contact',
              published: true
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        site_texts: {
          hero_title: 'Bienvenue chez Ma Boutique CBD',
          hero_subtitle: 'Découvrez notre sélection de produits CBD de qualité supérieure, soigneusement sélectionnés pour votre bien-être.',
          about_title: 'À propos de nous',
          about_content: 'Nous sommes spécialisés dans la vente de produits CBD de qualité, sélectionnés avec soin pour vous offrir les meilleurs bienfaits naturels.',
          products_title: 'Nos Produits Phares',
          products_subtitle: 'Une sélection de nos meilleurs produits CBD pour votre bien-être quotidien.',
          footer_text: '© 2024 Ma Boutique CBD. Tous droits réservés.',
          cta_button: 'Voir tous nos produits',
          cta_secondary: 'Nous suivre'
        },
        categories: [
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
        ]
      };
      return NextResponse.json(mockContent);
    }

    // Utiliser Supabase si configuré
    const [pagesResult, textsResult, categoriesResult] = await Promise.all([
      supabaseAdmin.from('pages').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('site_texts').select('*').single(),
      supabaseAdmin.from('categories').select('*').eq('is_active', true).order('name', { ascending: true })
    ]);

    return NextResponse.json({
      pages: pagesResult.data || [],
      site_texts: textsResult.data || {},
      categories: categoriesResult.data || []
    });
  } catch (error) {
    console.error('Erreur API content:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/admin/content - Créer une nouvelle page
export async function POST(request: NextRequest) {
  try {
    const { page_key, content } = await request.json();

    if (isUsingMockData()) {
      const newPage = {
        id: Date.now().toString(),
        page_key,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return NextResponse.json({ page: newPage });
    }

    const { data, error } = await supabaseAdmin
      .from('pages')
      .insert({
        page_key,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création page:', error);
      return NextResponse.json({ error: 'Erreur création page' }, { status: 500 });
    }

    return NextResponse.json({ page: data });
  } catch (error) {
    console.error('Erreur API content POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT /api/admin/content - Mettre à jour les textes du site
export async function PUT(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (isUsingMockData()) {
      return NextResponse.json({ success: true, message: 'Contenu mis à jour (mode démo)' });
    }

    if (type === 'site_texts') {
      const { error } = await supabaseAdmin
        .from('site_texts')
        .upsert(data, { onConflict: 'id' });

      if (error) {
        console.error('Erreur mise à jour textes:', error);
        return NextResponse.json({ error: 'Erreur mise à jour textes' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Contenu mis à jour' });
  } catch (error) {
    console.error('Erreur API content PUT:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}