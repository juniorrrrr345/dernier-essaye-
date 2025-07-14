'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const response = await fetch('/api/admin/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          router.push('/admin/dashboard');
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
  };

  useEffect(() => {
    // Vérifier si déjà connecté
    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder au panel d&apos;administration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Connexion Sécurisée</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <Input
                    label="Mot de passe administrateur"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    error={error}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={!password}
                >
                  Se connecter
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            Accès restreint aux administrateurs autorisés uniquement
          </p>
        </motion.div>
      </div>
    </div>
  );
}