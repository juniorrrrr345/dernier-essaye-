'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, Play, ExternalLink, Image } from 'lucide-react';
import Link from 'next/link';

function ProductFormPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEditing = !!productId;

  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    video_url: '',
    thumbnail_url: '',
    order_link: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && productId) {
      fetchProduct(productId);
    }
  }, [isEditing, productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Erreur récupération produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProduct({ ...product, thumbnail_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setProduct({ ...product, video_url: url });
    }
  };

  const uploadFile = async (file: File, type: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return type === 'image' ? result.url : result.url;
      }
    } catch (error) {
      console.error(`Erreur upload ${type}:`, error);
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.name?.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!product.description?.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!product.price || product.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }
    if (!product.video_url?.trim()) {
      newErrors.video_url = 'La vidéo est requise';
    }
    if (!product.thumbnail_url?.trim()) {
      newErrors.thumbnail_url = 'L\'image miniature est requise';
    }
    if (!product.order_link?.trim()) {
      newErrors.order_link = 'Le lien de commande est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      let thumbnailUrl = product.thumbnail_url;
      let videoUrl = product.video_url;

      // Upload des fichiers si nécessaire
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'image');
      }
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, 'video');
      }

      const productData = {
        ...product,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl
      };

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/products/${productId}` : '/api/admin/products';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        alert('Erreur: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
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
                {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informations du produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={product.name || ''}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="Huile CBD 10%"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description *
                    </label>
                    <textarea
                      value={product.description || ''}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 ${
                        errors.description ? 'border-red-500' : ''
                      }`}
                      placeholder="Description détaillée du produit..."
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.price || ''}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.price ? 'border-red-500' : ''
                      }`}
                      placeholder="29.99"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lien de commande *
                    </label>
                    <input
                      type="url"
                      value={product.order_link || ''}
                      onChange={(e) => setProduct({ ...product, order_link: e.target.value })}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.order_link ? 'border-red-500' : ''
                      }`}
                      placeholder="https://exemple.com/commande"
                    />
                    {errors.order_link && <p className="text-red-500 text-xs mt-1">{errors.order_link}</p>}
                    {product.order_link && (
                      <div className="mt-2">
                        <a
                          href={product.order_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 text-sm hover:underline flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Tester le lien
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={product.is_active || false}
                      onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Produit actif (visible sur le site)
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upload de fichiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Médias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image miniature */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image miniature *
                    </label>
                    {product.thumbnail_url && (
                      <div className="mb-4">
                        <img
                          src={product.thumbnail_url}
                          alt="Aperçu"
                          className="w-full h-48 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload">
                        <Button variant="outline">
                          <span className="cursor-pointer">
                            <Image className="h-4 w-4 mr-2" />
                            Choisir une image
                          </span>
                        </Button>
                      </label>
                      {thumbnailFile && (
                        <span className="text-sm text-gray-600">
                          {thumbnailFile.name}
                        </span>
                      )}
                    </div>
                    {errors.thumbnail_url && <p className="text-red-500 text-xs mt-1">{errors.thumbnail_url}</p>}
                  </div>

                  {/* Vidéo */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vidéo du produit *
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          URL de la vidéo
                        </label>
                        <input
                          type="url"
                          value={product.video_url || ''}
                          onChange={(e) => setProduct({ ...product, video_url: e.target.value })}
                          className="w-full p-2 border rounded-md text-sm"
                          placeholder="https://exemple.com/video.mp4"
                        />
                      </div>
                      <div className="text-center text-gray-500 text-sm">ou</div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload">
                          <Button variant="outline">
                            <span className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choisir une vidéo
                            </span>
                          </Button>
                        </label>
                        {videoFile && (
                          <span className="text-sm text-gray-600">
                            {videoFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>}
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
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu du produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Aperçu de la carte produit */}
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                      {product.thumbnail_url ? (
                        <img
                          src={product.thumbnail_url}
                          alt={product.name || 'Produit'}
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      <h3 className="font-medium text-lg mb-2">
                        {product.name || 'Nom du produit'}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description || 'Description du produit...'}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-green-600 text-xl">
                          {product.price ? `${product.price}€` : '0€'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <Button className="w-full mb-3" disabled={!product.order_link}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Commander
                      </Button>

                      {product.video_url && (
                        <Button variant="outline" className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Voir la vidéo
                        </Button>
                      )}
                    </div>

                    {/* Aperçu vidéo */}
                    {product.video_url && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Aperçu vidéo</h4>
                        <video
                          controls
                          className="w-full rounded-md"
                          poster={product.thumbnail_url}
                        >
                          <source src={product.video_url} type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      </div>
                    )}
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

export default function ProductFormPage() {
  return (
    <Suspense>
      <ProductFormPageInner />
    </Suspense>
  );
}