'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Settings, Users, Package, Eye, ExternalLink, Palette, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Modal pour l'édition des produits
const ProductEditModal = ({ product, isOpen, onClose, onSave }: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSave = async () => {
    if (!product || !formData.name || !formData.description || !formData.price) return;

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.product);
        onClose();
      }
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Modifier le produit</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL de la vidéo</label>
              <input
                type="url"
                value={formData.video_url || ''}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL de l&apos;image miniature</label>
              <input
                type="url"
                value={formData.thumbnail_url || ''}
                onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lien de commande</label>
              <input
                type="url"
                value={formData.order_link || ''}
                onChange={(e) => setFormData({...formData, order_link: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active || false}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium">Produit actif</label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour la suppression des produits
const ProductDeleteModal = ({ product, isOpen, onClose, onDelete }: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (productId: string) => void;
}) => {
  const handleDelete = async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onDelete(product.id);
        onClose();
      }
    } catch (error) {
      console.error('Erreur suppression produit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Supprimer le produit</h3>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le produit &quot;{product?.name}&quot; ? Cette action est irréversible.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour l'aperçu vidéo des produits
const ProductVideoModal = ({ product, isOpen, onClose }: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          </div>
          
          <div className="aspect-video">
            <video 
              controls 
              className="w-full h-full rounded-lg"
              poster={product.thumbnail_url}
            >
              <source src={product.video_url} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{product.price}€</p>
            </div>
            <Button asChild>
              <a href={product.order_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Commander
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Erreur récupération produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSave = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleProductDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Panel d&apos;Administration
            </h1>
            <Link href="/">
              <Button variant="outline">
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  Produits en ligne
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configuration</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  Boutique configurée
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administration</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  Admin connecté
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Configuration rapide */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration de la boutique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/config/shop">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Palette className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium">Apparence</h3>
                  <p className="text-sm text-gray-600">Logo, couleurs, thème</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/config/content">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Edit className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium">Contenu</h3>
                  <p className="text-sm text-gray-600">Textes, pages</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/config/social">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Share2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium">Réseaux sociaux</h3>
                  <p className="text-sm text-gray-600">Liens sociaux</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/config/general">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h3 className="font-medium">Général</h3>
                  <p className="text-sm text-gray-600">Paramètres généraux</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Gestion des Produits
            </h2>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span className="text-lg">{product.name}</span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setViewingProduct(product)}
                            title="Voir la vidéo"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => setDeletingProduct(product)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Image 
                        src={product.thumbnail_url} 
                        alt={product.name}
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-green-600">
                          {product.price}€
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        asChild
                      >
                        <a href={product.order_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le lien de commande
                        </a>
                      </Button>
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
              transition={{ duration: 0.5 }}
            >
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun produit
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par ajouter votre premier produit.
              </p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProductEditModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleProductSave}
      />

      <ProductDeleteModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onDelete={handleProductDelete}
      />

      <ProductVideoModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
      />
    </div>
  );
}