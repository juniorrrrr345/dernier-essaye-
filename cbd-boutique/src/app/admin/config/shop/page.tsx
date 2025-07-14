'use client';

import { useState, useEffect } from 'react';
import { ShopConfig } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, Palette, Type, Image } from 'lucide-react';
import Link from 'next/link';

export default function ShopConfigPage() {
  const [config, setConfig] = useState<Partial<ShopConfig>>({
    shop_name: '',
    background_color: '#ffffff',
    background_image_url: '',
    dark_mode: false,
    footer_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config || {});
      }
    } catch (error) {
      console.error('Erreur récupération config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('file', logoFile);
    formData.append('type', 'logo');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      }
    } catch (error) {
      console.error('Erreur upload logo:', error);
    }
    return null;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let logoUrl = config.logo_url;
      
      // Upload du logo si un nouveau fichier a été sélectionné
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          logo_url: logoUrl
        })
      });

      if (response.ok) {
        const result = await response.json();
        setConfig(result.config);
        setLogoFile(null);
        setLogoPreview('');
        alert('Configuration sauvegardée avec succès !');
      }
    } catch (error) {
      console.error('Erreur sauvegarde config:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Retour</span>
                </Button>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Configuration de l&apos;apparence
              </h1>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder les changements'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Configuration */}
          <div className="space-y-4 sm:space-y-6">
            {/* Informations générales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Type className="h-5 w-5 mr-2" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom de la boutique
                    </label>
                    <input
                      type="text"
                      value={config.shop_name || ''}
                      onChange={(e) => setConfig({...config, shop_name: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Ma Boutique CBD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Texte du pied de page
                    </label>
                    <textarea
                      value={config.footer_text || ''}
                      onChange={(e) => setConfig({...config, footer_text: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 text-base"
                      placeholder="© 2024 Ma Boutique CBD. Tous droits réservés."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Image className="h-5 w-5 mr-2" />
                    Logo de la boutique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Logo actuel
                    </label>
                    {(logoPreview || config.logo_url) && (
                      <div className="mb-4">
                        <img
                          src={logoPreview || config.logo_url}
                          alt="Logo de la boutique"
                          className="h-20 w-auto object-contain border rounded-md p-2"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button variant="outline">
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choisir un logo
                          </span>
                        </Button>
                      </label>
                      {logoFile && (
                        <span className="text-sm text-gray-600">
                          {logoFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Couleurs et thème */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Couleurs et thème
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Couleur de fond principale
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.background_color || '#ffffff'}
                        onChange={(e) => setConfig({...config, background_color: e.target.value})}
                        className="h-10 w-20 border rounded-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.background_color || '#ffffff'}
                        onChange={(e) => setConfig({...config, background_color: e.target.value})}
                        className="flex-1 p-2 border rounded-md"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Image de fond (optionnel)
                    </label>
                    <input
                      type="url"
                      value={config.background_image_url || ''}
                      onChange={(e) => setConfig({...config, background_image_url: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="dark_mode"
                      checked={config.dark_mode || false}
                      onChange={(e) => setConfig({...config, dark_mode: e.target.checked})}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="dark_mode" className="text-sm font-medium">
                      Mode sombre
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Aperçu */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de la boutique</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border rounded-lg overflow-hidden shadow-sm"
                    style={{
                      backgroundColor: config.background_color || '#ffffff',
                      backgroundImage: config.background_image_url ? `url(${config.background_image_url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Header preview */}
                    <div className="bg-white bg-opacity-95 p-4 border-b">
                      <div className="flex items-center justify-between">
                        {(logoPreview || config.logo_url) ? (
                          <img
                            src={logoPreview || config.logo_url}
                            alt="Logo de la boutique"
                            className="h-8 w-auto"
                          />
                        ) : (
                          <div className="text-xl font-bold text-green-600">
                            {config.shop_name || 'Ma Boutique CBD'}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">Menu</div>
                      </div>
                    </div>

                    {/* Content preview */}
                    <div className="p-6 bg-white bg-opacity-90">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          Nos Produits Phares
                        </h1>
                        <p className="text-gray-600">
                          Une sélection de nos meilleurs produits CBD
                        </p>
                      </div>

                      {/* Produit exemple */}
                      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <div className="bg-gray-200 h-32 rounded-md mb-3"></div>
                        <h3 className="font-medium">Huile CBD 10%</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Huile CBD naturelle et bio, 10ml
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">29,99€</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Actif
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer preview */}
                    <div className="bg-gray-900 text-white p-4 text-center">
                      <p className="text-sm">
                        {config.footer_text || '© 2024 Ma Boutique CBD. Tous droits réservés.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}