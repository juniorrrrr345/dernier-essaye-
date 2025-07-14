'use client';

import { useEffect, useState } from 'react';
import { SocialMedia } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ExternalLink, Instagram, Facebook, Twitter, Youtube, Globe } from 'lucide-react';
import { useShopConfig } from '@/components/providers/ShopConfigProvider';

export default function ReseauxSociauxPage() {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const { config } = useShopConfig();

  const shopName = config?.shop_name || 'Ma Boutique CBD';

  useEffect(() => {
    fetchSocialMedias();
  }, []);

  const fetchSocialMedias = async () => {
    try {
      // TODO: Implémenter l'API pour les réseaux sociaux
      // const response = await fetch('/api/social-media');
      // if (response.ok) {
      //   const data = await response.json();
      //   setSocialMedias(data.socialMedias);
      // }
      
      // Pour l'instant, données factices
      setSocialMedias([
        {
          id: '1',
          platform: 'Instagram',
          url: 'https://instagram.com/ma-boutique-cbd',
          icon: 'instagram',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'Facebook',
          url: 'https://facebook.com/ma-boutique-cbd',
          icon: 'facebook',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Erreur récupération réseaux sociaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-8 w-8" />;
      case 'facebook':
        return <Facebook className="h-8 w-8" />;
      case 'twitter':
        return <Twitter className="h-8 w-8" />;
      case 'youtube':
        return <Youtube className="h-8 w-8" />;
      default:
        return <Globe className="h-8 w-8" />;
    }
  };

  const getColorClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      case 'facebook':
        return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
      case 'twitter':
        return 'from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600';
      case 'youtube':
        return 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      default:
        return 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Réseaux Sociaux
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Suivez {shopName} sur les réseaux sociaux pour rester informé de nos dernières actualités, 
            conseils bien-être et nouveaux produits CBD.
          </p>
        </motion.div>

        {/* Social Media Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl shadow-lg h-32 animate-pulse"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : socialMedias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialMedias.map((social, index) => (
              <motion.div
                key={social.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className={`bg-gradient-to-r ${getColorClass(social.platform)} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getIcon(social.icon)}
                            <div>
                              <h3 className="text-xl font-semibold">
                                {social.platform}
                              </h3>
                              <p className="text-white/80 text-sm">
                                Suivez-nous sur {social.platform}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-6 w-6 text-white/80" />
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-gray-600 text-sm">
                          Cliquez pour accéder à notre page {social.platform}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <Globe className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Réseaux sociaux à venir
            </h3>
            <p className="text-gray-600 mb-8">
              Nous préparons actuellement notre présence sur les réseaux sociaux. 
              Revenez bientôt pour nous suivre !
            </p>
            <Button variant="outline">
              Être notifié
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        {socialMedias.length > 0 && (
          <motion.div
            className="text-center mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez notre communauté !
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Suivez-nous pour découvrir nos conseils bien-être, nos nouveautés et 
                             bénéficier d&apos;offres exclusives réservées à notre communauté.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {socialMedias.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${getColorClass(social.platform)} text-white font-medium hover:scale-105 transition-transform`}
                >
                  {getIcon(social.icon)}
                  <span className="ml-2">{social.platform}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}