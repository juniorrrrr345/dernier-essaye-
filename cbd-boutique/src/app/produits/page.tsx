'use client';

import { useEffect, useState, Suspense } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Search, Tag, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

function ProduitsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchCategories();
    };
    loadData();
  }, []);

  useEffect(() => {
    // Vérifier si une catégorie est spécifiée dans l'URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      let url = '/api/products';
      if (selectedCategory) {
        url = `/api/products/category/${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur récupération produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSearchQuery('');
    setLoading(true);
    
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    if (categorySlug) {
      url.searchParams.set('category', categorySlug);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());
    
    // Recharger les produits
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url.toString());
    fetchProducts();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Produits CBD
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explorez notre gamme complète de produits CBD de haute qualité, 
            conçus pour répondre à tous vos besoins de bien-être.
          </p>

          {/* Search Bar */}
          <motion.div
            className="max-w-md mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </motion.div>
        </motion.div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !selectedCategory
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes les catégories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedCategory === category.slug
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(selectedCategory || searchQuery) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Filtres actifs :</span>
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Catégorie: {categories.find(c => c.slug === selectedCategory)?.name}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-2 hover:text-green-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Recherche: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Effacer tous les filtres
              </button>
            </div>
          </motion.div>
        )}

        {/* Products Count */}
        {!loading && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} 
                                     pour &quot;{searchQuery}&quot;
                </>
              ) : (
                `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} disponible${filteredProducts.length > 1 ? 's' : ''}`
              )}
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl shadow-lg h-96 animate-pulse"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez avec d&apos;autres mots-clés ou parcourez tous nos produits.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Effacer la recherche
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600">
              Les produits seront bientôt disponibles. Revenez nous voir !
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProduitsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <ProduitsPageContent />
    </Suspense>
  );
}