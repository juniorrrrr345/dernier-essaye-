import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShopConfigProvider } from '@/components/providers/ShopConfigProvider';
import DebugPanel from '@/components/DebugPanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ma Boutique CBD - Produits de qualité',
  description: 'Découvrez notre sélection de produits CBD de qualité supérieure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ShopConfigProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <DebugPanel isVisible={true} />
          </div>
        </ShopConfigProvider>
      </body>
    </html>
  );
}
