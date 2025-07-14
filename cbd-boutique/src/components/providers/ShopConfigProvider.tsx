'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ShopConfig } from '@/types';

interface ShopConfigContextType {
  config: ShopConfig | null;
  loading: boolean;
  refetchConfig: () => Promise<void>;
}

const ShopConfigContext = createContext<ShopConfigContextType | undefined>(undefined);

export function useShopConfig() {
  const context = useContext(ShopConfigContext);
  if (context === undefined) {
    throw new Error('useShopConfig must be used within a ShopConfigProvider');
  }
  return context;
}

interface ShopConfigProviderProps {
  children: ReactNode;
}

export function ShopConfigProvider({ children }: ShopConfigProviderProps) {
  const [config, setConfig] = useState<ShopConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Erreur récupération config:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetchConfig = async () => {
    setLoading(true);
    await fetchConfig();
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Appliquer le style de fond dynamiquement
  useEffect(() => {
    if (config) {
      const body = document.body;
      
      // Appliquer la couleur de fond ou l'image
      if (config.background_image_url) {
        body.style.backgroundImage = `url(${config.background_image_url})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundAttachment = 'fixed';
      } else {
        body.style.backgroundImage = 'none';
        body.style.backgroundColor = config.background_color;
      }

      // Appliquer le mode sombre/clair
      if (config.dark_mode) {
        body.classList.add('dark');
      } else {
        body.classList.remove('dark');
      }
    }
  }, [config]);

  return (
    <ShopConfigContext.Provider 
      value={{ 
        config, 
        loading, 
        refetchConfig 
      }}
    >
      {children}
    </ShopConfigContext.Provider>
  );
}