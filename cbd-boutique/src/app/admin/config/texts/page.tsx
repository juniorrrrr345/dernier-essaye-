'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Type, Home, Info, Package, Mail } from 'lucide-react';
import Link from 'next/link';

interface SiteTexts {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_content: string;
  products_title: string;
  products_subtitle: string;
  footer_text: string;
  cta_button: string;
  cta_secondary: string;
}

export default function TextsConfigPage() {
  const [texts, setTexts] = useState<SiteTexts>({
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_content: '',
    products_title: '',
    products_subtitle: '',
    footer_text: '',
    cta_button: '',
    cta_secondary: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTexts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setTexts(data.site_texts || {});
      }
    } catch (error) {
      console.error('Erreur récupération textes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'site_texts',
          data: texts
        })
      });

      if (response.ok) {
        alert('Textes sauvegardés avec succès !');
      }
    } catch (error) {
      console.error('Erreur sauvegarde textes:', error);
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
                Textes de la boutique
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
          {/* Section Hero */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Home className="h-5 w-5 mr-2" />
                    Section d&apos;accueil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre principal *
                    </label>
                    <input
                      type="text"
                      value={texts.hero_title}
                      onChange={(e) => setTexts({...texts, hero_title: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Bienvenue chez Ma Boutique CBD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sous-titre *
                    </label>
                    <textarea
                      value={texts.hero_subtitle}
                      onChange={(e) => setTexts({...texts, hero_subtitle: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 text-base"
                      placeholder="Découvrez notre sélection de produits CBD..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bouton principal
                      </label>
                      <input
                        type="text"
                        value={texts.cta_button}
                        onChange={(e) => setTexts({...texts, cta_button: e.target.value})}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                        placeholder="Voir tous nos produits"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bouton secondaire
                      </label>
                      <input
                        type="text"
                        value={texts.cta_secondary}
                        onChange={(e) => setTexts({...texts, cta_secondary: e.target.value})}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                        placeholder="Nous suivre"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section À propos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Info className="h-5 w-5 mr-2" />
                    Section À propos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      value={texts.about_title}
                      onChange={(e) => setTexts({...texts, about_title: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="À propos de nous"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contenu de la section
                    </label>
                    <textarea
                      value={texts.about_content}
                      onChange={(e) => setTexts({...texts, about_content: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 text-base"
                      placeholder="Nous sommes spécialisés dans la vente de produits CBD..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Section Produits et Footer */}
          <div className="space-y-4 sm:space-y-6">
            {/* Section Produits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Package className="h-5 w-5 mr-2" />
                    Section Produits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      value={texts.products_title}
                      onChange={(e) => setTexts({...texts, products_title: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Nos Produits Phares"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sous-titre de la section
                    </label>
                    <textarea
                      value={texts.products_subtitle}
                      onChange={(e) => setTexts({...texts, products_subtitle: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 text-base"
                      placeholder="Une sélection de nos meilleurs produits..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Mail className="h-5 w-5 mr-2" />
                    Pied de page
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Texte du footer
                    </label>
                    <textarea
                      value={texts.footer_text}
                      onChange={(e) => setTexts({...texts, footer_text: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 text-base"
                      placeholder="© 2024 Ma Boutique CBD. Tous droits réservés."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Aperçu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Type className="h-5 w-5 mr-2" />
                    Aperçu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white space-y-4">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {texts.hero_title || 'Titre principal'}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {texts.hero_subtitle || 'Sous-titre'}
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">
                        {texts.about_title || 'À propos'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {texts.about_content || 'Contenu à propos'}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">
                        {texts.products_title || 'Produits'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {texts.products_subtitle || 'Description des produits'}
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