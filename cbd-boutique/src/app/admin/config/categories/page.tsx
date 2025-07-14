'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, Edit, Trash2, Tag, X } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CategoriesConfigPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Catégorie sauvegardée avec succès !');
        setFormData({ name: '', description: '', image_url: '' });
        setShowForm(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Erreur sauvegarde catégorie:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Catégorie supprimée avec succès !');
          fetchCategories();
        }
      } catch (error) {
        console.error('Erreur suppression catégorie:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'category');

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image_url: data.url }));
      }
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image');
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
                Gestion des catégories
              </h1>
            </div>
            <Button 
              onClick={() => {
                setShowForm(true);
                setEditingCategory(null);
                setFormData({ name: '', description: '', image_url: '' });
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une catégorie
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Liste des catégories */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Tag className="h-5 w-5 mr-2" />
                    Catégories existantes ({categories.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucune catégorie créée pour le moment
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {category.image_url && (
                                                                 <img 
                                   src={category.image_url} 
                                   alt={`Image de ${category.name}`}
                                   className="w-16 h-16 object-cover rounded-lg"
                                 />
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{category.name}</h3>
                                <p className="text-gray-600 text-sm">{category.description}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Slug: {category.slug}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Formulaire d'ajout/modification */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Plus className="h-5 w-5 mr-2" />
                      {editingCategory ? 'Modifier' : 'Nouvelle'} catégorie
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom de la catégorie *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="Ex: Huiles CBD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 text-base"
                      placeholder="Description de la catégorie..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image de la catégorie
                    </label>
                    <div className="space-y-2">
                      {formData.image_url && (
                                                 <img 
                           src={formData.image_url} 
                           alt="Aperçu de l'image de catégorie"
                           className="w-full h-32 object-cover rounded-lg"
                         />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={saving || !formData.name || !formData.description}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
                    size="lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {saving ? 'Sauvegarde...' : (editingCategory ? 'Modifier' : 'Créer')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}