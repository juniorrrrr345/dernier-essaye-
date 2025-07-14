-- Script d'initialisation pour Supabase
-- Copiez ce contenu dans l'éditeur SQL de Supabase

-- Table pour la configuration de la boutique
CREATE TABLE IF NOT EXISTS shop_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_name TEXT NOT NULL DEFAULT 'Ma Boutique CBD',
  background_color TEXT NOT NULL DEFAULT '#ffffff',
  background_image_url TEXT,
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  footer_text TEXT NOT NULL DEFAULT '© 2024 Ma Boutique CBD. Tous droits réservés.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les produits
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  order_link TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les réseaux sociaux
CREATE TABLE IF NOT EXISTS social_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour le contenu des pages
CREATE TABLE IF NOT EXISTS page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données par défaut
INSERT INTO shop_config (shop_name, background_color, dark_mode, footer_text)
SELECT 'Ma Boutique CBD', '#ffffff', false, '© 2024 Ma Boutique CBD. Tous droits réservés.'
WHERE NOT EXISTS (SELECT 1 FROM shop_config);

-- RLS Policies (Row Level Security)
ALTER TABLE shop_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policies pour permettre la lecture publique
CREATE POLICY "Allow public read on shop_config" ON shop_config FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on social_media" ON social_media FOR SELECT USING (true);
CREATE POLICY "Allow public read on page_content" ON page_content FOR SELECT USING (true);

-- Policies pour permettre toutes les opérations (admin seulement)
CREATE POLICY "Allow all operations on shop_config" ON shop_config FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on social_media" ON social_media FOR ALL USING (true);
CREATE POLICY "Allow all operations on page_content" ON page_content FOR ALL USING (true);