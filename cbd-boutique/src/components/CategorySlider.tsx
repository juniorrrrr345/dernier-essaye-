'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/content');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Erreur récupération catégories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Parcourir par catégorie
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos produits organisés par catégories pour trouver facilement ce qui vous convient
          </p>
        </motion.div>

        <div className="relative">
          {/* Boutons de navigation */}
          {categories.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Catégorie précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Catégorie suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Conteneur du slider */}
          <div className="overflow-hidden rounded-xl shadow-lg">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {categories[currentIndex] && (
                <div className="relative h-64 sm:h-80 lg:h-96">
                  {/* Image de fond */}
                  {categories[currentIndex].image_url && (
                    <div className="absolute inset-0">
                      <img
                        src={categories[currentIndex].image_url}
                        alt={`Image de la catégorie ${categories[currentIndex].name}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center text-white p-6 sm:p-8">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        {categories[currentIndex].name}
                      </h3>
                      <p className="text-lg sm:text-xl mb-6 max-w-2xl">
                        {categories[currentIndex].description}
                      </p>
                      <Link
                        href={`/products?category=${categories[currentIndex].slug}`}
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:scale-105"
                      >
                        Voir les produits
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Indicateurs */}
          {categories.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-green-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller à la catégorie ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation par clavier */}
          <div className="flex justify-center mt-4 space-x-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setCurrentIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}