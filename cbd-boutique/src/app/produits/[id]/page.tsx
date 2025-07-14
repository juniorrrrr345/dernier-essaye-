'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        // L'API retourne directement le produit
        setProduct(data);
      } else if (response.status === 404) {
        // Produit non trouvé - rediriger vers la liste
        router.push('/produits');
        return;
      } else {
        console.error('Erreur API:', response.status);
        router.push('/produits');
        return;
      }
    } catch (error) {
      console.error('Erreur récupération produit:', error);
      router.push('/produits');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (product?.order_link) {
      window.open(product.order_link, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-video bg-gray-300 rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Produit non trouvé
          </h1>
          <Link href="/produits">
            <Button>
              Retour aux produits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/produits"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Video Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
              {videoLoading && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-gray-600">Chargement de la vidéo...</span>
                  </div>
                </div>
              )}
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                onLoadedData={() => setVideoLoading(false)}
                poster={product.thumbnail_url}
              >
                <source src={product.video_url} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              
              {/* Play overlay for mobile */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
                <div className="bg-black bg-opacity-50 rounded-full p-4">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose prose-gray max-w-none">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="border-t border-gray-200 pt-6">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg"
                onClick={handleOrder}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Commander ce produit
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Vous serez redirigé vers notre partenaire de vente
              </p>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Livraison:</span> Rapide et sécurisée
                </div>
                <div>
                  <span className="font-medium">Qualité:</span> Contrôlée et certifiée
                </div>
                <div>
                  <span className="font-medium">Support:</span> Service client disponible
                </div>
                <div>
                  <span className="font-medium">Paiement:</span> 100% sécurisé
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products or Return Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/produits">
            <Button variant="outline" size="lg">
              Découvrir d&apos;autres produits
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}