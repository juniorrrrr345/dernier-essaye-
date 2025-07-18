'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useShopConfig } from '@/components/providers/ShopConfigProvider';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { config } = useShopConfig();

  const shopName = config?.shop_name || 'Ma Boutique CBD';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // L'API retourne directement le tableau de produits
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      }
    } catch (error) {
      console.error('Erreur récupération produits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Bienvenue chez{' '}
            <span className="text-green-600">{shopName}</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez notre sélection de produits CBD de qualité supérieure, 
            soigneusement sélectionnés pour votre bien-être.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/produits">
              <Button size="lg" className="px-8">
                Voir tous nos produits
              </Button>
            </Link>
            <Link href="/reseaux-sociaux">
              <Button variant="outline" size="lg" className="px-8">
                Nous suivre
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Produits Phares
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une sélection de nos meilleurs produits CBD pour votre bien-être quotidien.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl shadow-lg h-96 animate-pulse"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg text-gray-600 mb-8">
                Aucun produit disponible pour le moment.
              </p>
              <Link href="/admin">
                <Button>
                  Ajouter des produits
                </Button>
              </Link>
            </motion.div>
          )}

          {products.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Link href="/produits">
                <Button variant="outline" size="lg">
                  Voir tous nos produits ({products.length}+)
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
