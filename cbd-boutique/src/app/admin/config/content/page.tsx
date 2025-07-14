'use client';

import { useState, useEffect } from 'react';
import { PageContent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, FileText, Save } from 'lucide-react';
import Link from 'next/link';

interface ContentSection {
  key: string;
  title: string;
  description: string;
  value: string;
  type: 'text' | 'textarea' | 'rich';
}

const DEFAULT_CONTENT: ContentSection[] = [
  {
    key: 'hero_title',
    title: 'Titre principal',
    description: 'Le titre affiché en grand sur la page d\'accueil',
    value: 'Nos Produits Phares',
    type: 'text'
  },
  {
    key: 'hero_subtitle',
    title: 'Sous-titre',
    description: 'Le texte d\'accroche sous le titre principal',
    value: 'Une sélection de nos meilleurs produits CBD pour votre bien-être quotidien.',
    type: 'textarea'
  },
  {
    key: 'about_section',
    title: 'Section À propos',
    description: 'Texte de présentation de votre boutique',
    value: 'Découvrez notre gamme de produits CBD de haute qualité, soigneusement sélectionnés pour vous offrir les meilleurs bienfaits naturels.',
    type: 'textarea'
  },
  {
    key: 'contact_info',
    title: 'Informations de contact',
    description: 'Vos informations de contact (email, téléphone, etc.)',
    value: 'Email: contact@maboutiquecbd.fr\nTéléphone: 01 23 45 67 89',
    type: 'textarea'
  },
  {
    key: 'legal_notice',
    title: 'Mentions légales',
    description: 'Informations légales obligatoires',
    value: 'Conformément à la réglementation en vigueur, nos produits CBD contiennent moins de 0,2% de THC.',
    type: 'textarea'
  }
];

const PageEditModal = ({ page, isOpen, onClose, onSave }: {
  page: PageContent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: PageContent) => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    published: true
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: (page.content as any)?.title || '',
        content: (page.content as any)?.content || '',
        slug: (page.content as any)?.slug || '',
        published: (page.content as any)?.published || true
      });
    } else {
      setFormData({
        title: '',
        content: '',
        slug: '',
        published: true
      });
    }
  }, [page, isOpen]);

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.slug) return;

    try {
      const method = page ? 'PUT' : 'POST';
      const url = page ? `/api/admin/pages/${page.id}` : '/api/admin/pages';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_key: `custom_${formData.slug}`,
          content: formData
        })
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.page);
        onClose();
      }
    } catch (error) {
      console.error('Erreur sauvegarde page:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {page ? 'Modifier' : 'Créer'} une page
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre de la page</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="À propos de nous"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL (slug)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                  className="w-full p-2 border rounded-md"
                  placeholder="a-propos"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contenu</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 border rounded-md h-64"
                placeholder="Contenu de votre page..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Page publiée
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.content || !formData.slug}>
              {page ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContentConfigPage() {
  const [content, setContent] = useState<ContentSection[]>(DEFAULT_CONTENT);
  const [customPages, setCustomPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchCustomPages();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        // Fusionner avec le contenu par défaut
        const mergedContent = DEFAULT_CONTENT.map(defaultItem => {
          const savedItem = data.find((item: any) => item.page_key === defaultItem.key);
          return savedItem ? { ...defaultItem, value: savedItem.content.value } : defaultItem;
        });
        setContent(mergedContent);
      }
    } catch (error) {
      console.error('Erreur récupération contenu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setCustomPages(data || []);
      }
    } catch (error) {
      console.error('Erreur récupération pages:', error);
    }
  };

  const handleContentSave = async () => {
    setSaving(true);
    try {
      for (const item of content) {
        await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_key: item.key,
            content: { value: item.value }
          })
        });
      }
      alert('Contenu sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde contenu:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePageSave = (page: PageContent) => {
    if (editingPage) {
      setCustomPages(customPages.map(p => p.id === page.id ? page : p));
    } else {
      setCustomPages([...customPages, page]);
    }
    setEditingPage(null);
    setIsAddingNew(false);
  };

  const handlePageDelete = async (pageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCustomPages(customPages.filter(p => p.id !== pageId));
      }
    } catch (error) {
      console.error('Erreur suppression page:', error);
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion du contenu
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setIsAddingNew(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle page
              </Button>
              <Button onClick={handleContentSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenu principal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenu de la boutique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {item.title}
                      </label>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.description}
                      </p>
                      {item.type === 'text' ? (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const newContent = [...content];
                            newContent[index].value = e.target.value;
                            setContent(newContent);
                          }}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <textarea
                          value={item.value}
                          onChange={(e) => {
                            const newContent = [...content];
                            newContent[index].value = e.target.value;
                            setContent(newContent);
                          }}
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pages personnalisées */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages personnalisées</CardTitle>
              </CardHeader>
              <CardContent>
                {customPages.length > 0 ? (
                  <div className="space-y-3">
                    {customPages.map((page) => (
                      <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {(page.content as any)?.title || 'Page sans titre'}
                            </div>
                            <div className="text-sm text-gray-600">
                              /{(page.content as any)?.slug}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPage(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handlePageDelete(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune page personnalisée
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Créez des pages sur mesure pour votre boutique.
                    </p>
                    <Button onClick={() => setIsAddingNew(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une page
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aperçu */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white space-y-4">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {content.find(c => c.key === 'hero_title')?.value || 'Titre principal'}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {content.find(c => c.key === 'hero_subtitle')?.value || 'Sous-titre'}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">À propos</h3>
                    <p className="text-gray-600 text-sm">
                      {content.find(c => c.key === 'about_section')?.value || 'Section à propos'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal d'édition de page */}
      <PageEditModal
        page={editingPage}
        isOpen={!!editingPage || isAddingNew}
        onClose={() => {
          setEditingPage(null);
          setIsAddingNew(false);
        }}
        onSave={handlePageSave}
      />
    </div>
  );
}