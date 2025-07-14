import { createClient } from '@supabase/supabase-js';

// Configuration avec valeurs par défaut pour le déploiement sans variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Client pour le côté client (public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client pour le côté serveur (admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Données mockées pour le déploiement sans base de données
export const mockData = {
  shopConfig: {
    id: '1',
    shop_name: 'Ma Boutique CBD',
    background_color: '#ffffff',
    background_image_url: null,
    dark_mode: false,
    footer_text: '© 2024 Ma Boutique CBD. Tous droits réservés.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  products: [
    {
      id: '1',
      name: 'Huile CBD 10%',
      description: 'Huile CBD naturelle et bio, 10ml',
      price: 29.99,
      video_url: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      thumbnail_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      order_link: 'https://example.com/commande',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Gélules CBD 500mg',
      description: 'Gélules CBD pour un sommeil réparateur',
      price: 39.99,
      video_url: 'https://res.cloudinary.com/demo/video/upload/sample2.mp4',
      thumbnail_url: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
      order_link: 'https://example.com/commande2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  socialMedia: [
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/maboutiquecbd',
      icon: 'instagram',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      platform: 'Facebook',
      url: 'https://facebook.com/maboutiquecbd',
      icon: 'facebook',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// Fonction pour détecter si on utilise des données mockées
export const isUsingMockData = () => {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';
};