'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Ana Sayfa', icon: '🏠' },
    { href: '/create', label: 'Anket Oluştur', icon: '📝' },
    { href: '/templates', label: 'Şablonlar', icon: '📋' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-xl font-semibold text-primary"
            >
              <span className="mr-2">📮</span>
              <span>AnketApp</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center px-4 py-2 mx-1 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    pathname === link.href
                      ? 'text-primary bg-primary-light bg-opacity-20'
                      : 'text-text-secondary hover:text-primary hover:bg-background'
                  }
                `}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-background focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center px-3 py-3 rounded-lg text-sm font-medium
                  ${
                    pathname === link.href
                      ? 'text-primary bg-primary-light bg-opacity-20'
                      : 'text-text-secondary hover:text-primary hover:bg-background'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 