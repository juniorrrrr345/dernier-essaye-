import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/config - Récupérer la configuration publique de la boutique
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('shop_config')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur récupération config publique:', error);
      // Retourner une configuration par défaut si aucune n'est trouvée
      return NextResponse.json({ 
        config: {
          shop_name: 'Ma Boutique CBD',
          background_color: '#ffffff',
          background_image_url: null,
          dark_mode: false,
          footer_text: '© 2024 Ma Boutique CBD. Tous droits réservés.'
        }
      });
    }

    return NextResponse.json({ config: data });

  } catch (error) {
    console.error('Erreur API config publique:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}