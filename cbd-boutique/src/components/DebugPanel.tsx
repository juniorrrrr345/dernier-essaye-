'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface DebugInfo {
  products?: {
    status: number;
    count: number | string;
    data: unknown;
    error?: string;
  };
  config?: {
    status: number;
    data: unknown;
    error?: string;
  };
  admin?: {
    status: number;
    count: number | string;
    data: unknown;
    error?: string;
  };
}

interface DebugPanelProps {
  isVisible?: boolean;
}

export function DebugPanel({ isVisible = false }: DebugPanelProps) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [isOpen, setIsOpen] = useState(isVisible);

  const fetchDebugInfo = async () => {
    try {
      const info: DebugInfo = {};

      // Test API produits
      try {
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        info.products = {
          status: productsResponse.status,
          count: Array.isArray(productsData) ? productsData.length : 'Erreur de format',
          data: productsData
        };
      } catch (error) {
        info.products = { 
          status: 0,
          count: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }

      // Test API config
      try {
        const configResponse = await fetch('/api/config');
        const configData = await configResponse.json();
        info.config = {
          status: configResponse.status,
          data: configData
        };
      } catch (error) {
        info.config = { 
          status: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }

      // Test API admin
      try {
        const adminResponse = await fetch('/api/admin/products');
        const adminData = await adminResponse.json();
        info.admin = {
          status: adminResponse.status,
          count: Array.isArray(adminData) ? adminData.length : 'Erreur de format',
          data: adminData
        };
      } catch (error) {
        info.admin = { 
          status: 0,
          count: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }

      setDebugInfo(info);
    } catch (error) {
      console.error('Erreur debug:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDebugInfo();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Debug Panel</h3>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
              Fermer
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">API Produits</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.products, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">API Config</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.config, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">API Admin</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo.admin, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={fetchDebugInfo} variant="outline">
              Actualiser
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugPanel;