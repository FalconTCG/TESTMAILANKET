import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'AnketApp | Modern E-posta Anket Sistemi',
  description: 'Pastel renkli, kullanıcı dostu arayüzü ile müşteri memnuniyeti ölçümü için modern e-posta anket sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background text-text-primary flex flex-col font-sans">
        <Navigation />
        <main className="flex-grow py-6">
          <div className="page-container">
            {children}
          </div>
        </main>
        <footer className="py-8 border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center text-xl font-semibold text-primary mb-2">
                  <span className="mr-2">📮</span>
                  <span>AnketApp</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Modern e-posta anket sistemi
                </p>
              </div>
              <div className="text-sm text-text-light">
                © {new Date().getFullYear()} AnketApp. Tüm hakları saklıdır.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 