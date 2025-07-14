'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Settings, Database, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

interface GeneralSettings {
  maintenance_mode: boolean;
  analytics_code: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  contact_email: string;
  timezone: string;
  currency: string;
  default_language: string;
}

export default function GeneralConfigPage() {
  const [settings, setSettings] = useState<GeneralSettings>({
    maintenance_mode: false,
    analytics_code: '',
    seo_title: 'Ma Boutique CBD - Produits CBD de qualité',
    seo_description: 'Découvrez notre sélection de produits CBD de haute qualité. Huiles, gélules et bien plus pour votre bien-être naturel.',
    seo_keywords: 'CBD, huile CBD, gélules CBD, bien-être, naturel',
    contact_email: 'contact@maboutiquecbd.fr',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    default_language: 'fr'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (error) {
      console.error('Erreur récupération paramètres:', error);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Paramètres sauvegardés avec succès !');
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
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
                Configuration générale
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
          {/* Paramètres généraux */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Settings className="h-5 w-5 mr-2" />
                    Paramètres de base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="contact@maboutiquecbd.fr"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Devise
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Langue par défaut
                    </label>
                    <select
                      value={settings.default_language}
                      onChange={(e) => setSettings({...settings, default_language: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenance_mode" className="text-sm font-medium">
                      Mode maintenance
                    </label>
                  </div>
                  {settings.maintenance_mode && (
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            ⚠️ Le mode maintenance est activé. Seuls les administrateurs peuvent accéder au site.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* SEO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Référencement (SEO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Titre SEO
                    </label>
                    <input
                      type="text"
                      value={settings.seo_title}
                      onChange={(e) => setSettings({...settings, seo_title: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ma Boutique CBD - Produits CBD de qualité"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Affiché dans les résultats de recherche (max 60 caractères)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description SEO
                    </label>
                    <textarea
                      value={settings.seo_description}
                      onChange={(e) => setSettings({...settings, seo_description: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                      placeholder="Description de votre boutique..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Description affichée dans les résultats de recherche (max 160 caractères)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mots-clés SEO
                    </label>
                    <input
                      type="text"
                      value={settings.seo_keywords}
                      onChange={(e) => setSettings({...settings, seo_keywords: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="CBD, huile CBD, gélules CBD, bien-être"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Mots-clés séparés par des virgules
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Analytics et sécurité */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Code Google Analytics
                    </label>
                    <textarea
                      value={settings.analytics_code}
                      onChange={(e) => setSettings({...settings, analytics_code: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 font-mono text-sm"
                      placeholder="<!-- Collez ici votre code Google Analytics -->"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Code de tracking Google Analytics ou autre service d&apos;analyse
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations système */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Informations système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version de la boutique :</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base de données :</span>
                      <span className="font-medium">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Supabase' : 'Mode démo'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environnement :</span>
                      <span className="font-medium">
                        {process.env.NODE_ENV === 'production' ? 'Production' : 'Développement'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière sauvegarde :</span>
                      <span className="font-medium">Jamais</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Actions système</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Vider le cache
                      </Button>
                      <Button variant="outline" className="w-full">
                        Exporter les données
                      </Button>
                      <Button variant="outline" className="w-full text-red-600">
                        Réinitialiser la configuration
                      </Button>
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