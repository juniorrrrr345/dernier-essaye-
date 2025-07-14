'use client';

import { useState, useEffect } from 'react';
import { SocialMedia } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';

const SOCIAL_PLATFORMS = [
  { name: 'Facebook', icon: 'facebook', color: 'bg-blue-600' },
  { name: 'Instagram', icon: 'instagram', color: 'bg-pink-600' },
  { name: 'Twitter', icon: 'twitter', color: 'bg-sky-500' },
  { name: 'YouTube', icon: 'youtube', color: 'bg-red-600' },
  { name: 'LinkedIn', icon: 'linkedin', color: 'bg-blue-700' },
  { name: 'TikTok', icon: 'tiktok', color: 'bg-black' },
  { name: 'Autre', icon: 'globe', color: 'bg-gray-600' }
];

const SocialIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const iconClass = `h-5 w-5 ${className}`;
  
  switch (icon) {
    case 'facebook':
      return <Facebook className={iconClass} />;
    case 'instagram':
      return <Instagram className={iconClass} />;
    case 'twitter':
      return <Twitter className={iconClass} />;
    case 'youtube':
      return <Youtube className={iconClass} />;
    case 'linkedin':
      return <Linkedin className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
  }
};

const SocialEditModal = ({ social, isOpen, onClose, onSave }: {
  social: SocialMedia | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (social: SocialMedia) => void;
}) => {
  const [formData, setFormData] = useState<Partial<SocialMedia>>({
    platform: '',
    url: '',
    icon: 'globe'
  });

  useEffect(() => {
    if (social) {
      setFormData(social);
    } else {
      setFormData({
        platform: '',
        url: '',
        icon: 'globe'
      });
    }
  }, [social, isOpen]);

  const handleSave = async () => {
    if (!formData.platform || !formData.url) return;

    try {
      const method = social ? 'PUT' : 'POST';
      const url = social ? `/api/admin/social/${social.id}` : '/api/admin/social';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.social);
        onClose();
      }
    } catch (error) {
      console.error('Erreur sauvegarde réseau social:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {social ? 'Modifier' : 'Ajouter'} un réseau social
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plateforme</label>
              <select
                value={formData.platform || ''}
                onChange={(e) => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.name === e.target.value);
                  setFormData({
                    ...formData, 
                    platform: e.target.value,
                    icon: platform?.icon || 'globe'
                  });
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Sélectionner une plateforme</option>
                {SOCIAL_PLATFORMS.map(platform => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full p-2 border rounded-md"
                placeholder="https://..."
              />
            </div>

            {formData.platform && (
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <SocialIcon icon={formData.icon || 'globe'} />
                <span className="font-medium">{formData.platform}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!formData.platform || !formData.url}>
              {social ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SocialConfigPage() {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchSocialMedias();
  }, []);

  const fetchSocialMedias = async () => {
    try {
      const response = await fetch('/api/admin/social');
      if (response.ok) {
        const data = await response.json();
        setSocialMedias(data || []);
      }
    } catch (error) {
      console.error('Erreur récupération réseaux sociaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSave = (social: SocialMedia) => {
    if (editingSocial) {
      setSocialMedias(socialMedias.map(s => s.id === social.id ? social : s));
    } else {
      setSocialMedias([...socialMedias, social]);
    }
    setEditingSocial(null);
    setIsAddingNew(false);
  };

  const handleSocialDelete = async (socialId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) return;

    try {
      const response = await fetch(`/api/admin/social/${socialId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSocialMedias(socialMedias.filter(s => s.id !== socialId));
      }
    } catch (error) {
      console.error('Erreur suppression réseau social:', error);
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
                Gestion des réseaux sociaux
              </h1>
            </div>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un réseau social
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des réseaux sociaux */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Réseaux sociaux configurés</CardTitle>
              </CardHeader>
              <CardContent>
                {socialMedias.length > 0 ? (
                  <div className="space-y-3">
                    {socialMedias.map((social) => (
                      <motion.div
                        key={social.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full text-white ${
                            SOCIAL_PLATFORMS.find(p => p.icon === social.icon)?.color || 'bg-gray-600'
                          }`}>
                            <SocialIcon icon={social.icon} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{social.platform}</div>
                            <div className="text-sm text-gray-600 break-all">
                              {social.url}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSocial(social)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleSocialDelete(social.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun réseau social
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ajoutez vos liens vers les réseaux sociaux pour que vos clients puissent vous suivre.
                    </p>
                    <Button onClick={() => setIsAddingNew(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un réseau social
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Aperçu */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
                  
                  {socialMedias.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {socialMedias.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white transition-transform hover:scale-105 ${
                            SOCIAL_PLATFORMS.find(p => p.icon === social.icon)?.color || 'bg-gray-600'
                          }`}
                        >
                          <SocialIcon icon={social.icon} className="text-white" />
                          <span className="text-sm">{social.platform}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Aucun réseau social configuré
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guide d'aide */}
            <Card>
              <CardHeader>
                <CardTitle>Guide d&apos;utilisation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Comment ajouter un réseau social :</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      <li>Cliquez sur &quot;Ajouter un réseau social&quot;</li>
                      <li>Sélectionnez la plateforme dans la liste</li>
                      <li>Entrez l&apos;URL complète de votre profil</li>
                      <li>Cliquez sur &quot;Ajouter&quot;</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Exemples d&apos;URLs :</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><strong>Facebook :</strong> https://facebook.com/votrepage</li>
                      <li><strong>Instagram :</strong> https://instagram.com/votrecompte</li>
                      <li><strong>Twitter :</strong> https://twitter.com/votrecompte</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal d'édition */}
      <SocialEditModal
        social={editingSocial}
        isOpen={!!editingSocial || isAddingNew}
        onClose={() => {
          setEditingSocial(null);
          setIsAddingNew(false);
        }}
        onSave={handleSocialSave}
      />
    </div>
  );
}