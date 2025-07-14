'use client';

import { motion } from 'framer-motion';
import { useShopConfig } from '@/components/providers/ShopConfigProvider';

export function Footer() {
  const { config } = useShopConfig();
  
  const footerText = config?.footer_text || '© 2024 Ma Boutique CBD. Tous droits réservés.';
  const isDarkMode = config?.dark_mode || false;

  return (
    <footer className={`${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    } mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            {footerText}
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <motion.a
              href="/produits"
              className="text-sm hover:text-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Nos Produits
            </motion.a>
            <motion.a
              href="/reseaux-sociaux"
              className="text-sm hover:text-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Réseaux Sociaux
            </motion.a>
            <motion.a
              href="/admin"
              className="text-sm hover:text-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Administration
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;