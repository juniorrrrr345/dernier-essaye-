'use client';

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useShopConfig } from '@/components/providers/ShopConfigProvider';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config } = useShopConfig();

  const shopName = config?.shop_name || 'Ma Boutique CBD';
  const isDarkMode = config?.dark_mode || false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md ${
      isDarkMode 
        ? 'bg-gray-900/90 text-white' 
        : 'bg-white/90 text-gray-900'
    } border-b border-gray-200/20`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              {shopName}
            </Link>
          </motion.div>

          {/* Navigation Desktop */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link 
              href="/" 
              className="hover:text-green-600 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link 
              href="/produits" 
              className="hover:text-green-600 transition-colors font-medium"
            >
              Produits
            </Link>
            <Link 
              href="/reseaux-sociaux" 
              className="hover:text-green-600 transition-colors font-medium"
            >
              Réseaux sociaux
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Administration
              </Button>
            </Link>
          </motion.div>

          {/* Menu Mobile Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={toggleMenu}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg mt-2 border border-gray-200/20">
              <Link 
                href="/" 
                className="block px-3 py-2 text-base font-medium hover:text-green-600 transition-colors"
                onClick={toggleMenu}
              >
                Accueil
              </Link>
              <Link 
                href="/produits" 
                className="block px-3 py-2 text-base font-medium hover:text-green-600 transition-colors"
                onClick={toggleMenu}
              >
                Produits
              </Link>
              <Link 
                href="/reseaux-sociaux" 
                className="block px-3 py-2 text-base font-medium hover:text-green-600 transition-colors"
                onClick={toggleMenu}
              >
                Réseaux sociaux
              </Link>
              <Link 
                href="/admin" 
                className="block px-3 py-2"
                onClick={toggleMenu}
              >
                <Button variant="outline" size="sm" className="w-full">
                  Administration
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}

export default Header;