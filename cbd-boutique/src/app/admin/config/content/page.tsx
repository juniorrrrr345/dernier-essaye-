'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Edit, Plus, FileText, Globe, Info, Mail } from 'lucide-react';
import Link from 'next/link';

interface PageContentData {
  title: string;
  content: string;
  slug: string;
  published: boolean;
}

interface PageContent {
  id: string;
  page_key: string;
  content: PageContentData;
  created_at: string;
  updated_at: string;
}

export default function ContentConfigPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState<PageContentData>({
    title: '',
    content: '',
    slug: '',
    published: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Erreur récupération pages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (selectedPage) {
      setFormData({
        title: (selectedPage.content as PageContentData)?.title || '',
        content: (selectedPage.content as PageContentData)?.content || '',
        slug: (selectedPage.content as PageContentData)?.slug || '',
        published: (selectedPage.content as PageContentData)?.published || true
      });
    } else {
      setFormData({
        title: '',
        content: '',
        slug: '',
        published: true
      });
    }
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedPage 
        ? `/api/admin/content/${selectedPage.id}`
        : '/api/admin/content';
      
      const method = selectedPage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_key: selectedPage?.page_key || formData.slug,
          content: formData
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (selectedPage) {
          setPages(pages.map(p => p.id === selectedPage.id ? result.page : p));
        } else {
          setPages([...pages, result.page]);
        }
        setSelectedPage(null);
        setShowForm(false);
        alert('Page sauvegardée avec succès !');
      }
    } catch (error) {
      console.error('Erreur sauvegarde page:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;
    
    try {
      const response = await fetch(`/api/admin/content/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPages(pages.filter(p => p.id !== pageId));
        alert('Page supprimée avec succès !');
      }
    } catch (error) {
      console.error('Erreur suppression page:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getPageIcon = (pageKey: string) => {
    switch (pageKey) {
      case 'about': return <Info className="h-5 w-5" />;
      case 'contact': return <Mail className="h-5 w-5" />;
      case 'privacy': return <FileText className="h-5 w-5" />;
      case 'terms': return <FileText className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const getPageTitle = (pageKey: string) => {
    switch (pageKey) {
      case 'about': return 'À propos';
      case 'contact': return 'Contact';
      case 'privacy': return 'Politique de confidentialité';
      case 'terms': return 'Conditions d\'utilisation';
      default: return pageKey;
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
                Gestion du contenu
              </h1>
            </div>
            <Button 
              onClick={() => {
                setSelectedPage(null);
                setShowForm(true);
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer une page
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Liste des pages */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Pages existantes ({pages.length})
            </h2>
            
            {pages.length > 0 ? (
              <div className="space-y-4">
                {pages.map((page) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            {getPageIcon(page.page_key)}
                            <div>
                              <h3 className="font-medium">
                                {getPageTitle(page.page_key)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {(page.content as PageContentData)?.title || 'Sans titre'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedPage(page);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(page.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            (page.content as PageContentData)?.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {(page.content as PageContentData)?.published ? 'Publié' : 'Brouillon'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Modifié le {new Date(page.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune page
                </h3>
                <p className="text-gray-600 mb-6">
                  Créez votre première page de contenu.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedPage(null);
                    setShowForm(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une page
                </Button>
              </motion.div>
            )}
          </div>

          {/* Formulaire d'édition */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Edit className="h-5 w-5 mr-2" />
                    {selectedPage ? 'Modifier la page' : 'Créer une nouvelle page'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre de la page *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Titre de la page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="nom-de-la-page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contenu *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 text-base"
                      placeholder="Contenu de la page..."
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="text-sm font-medium">
                      Page publiée (visible sur le site)
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedPage(null);
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}