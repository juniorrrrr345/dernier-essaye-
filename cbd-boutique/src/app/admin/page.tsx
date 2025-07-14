'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger directement vers le dashboard sans authentification
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="h-6 w-6 bg-green-600 rounded"></div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Redirection...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accès au panel d&apos;administration
          </p>
        </div>
      </div>
    </div>
  );
}