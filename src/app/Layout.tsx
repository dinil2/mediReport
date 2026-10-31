import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DisclaimerBanner } from '../components/layout/DisclaimerBanner';

export const Layout: React.FC = () => {
  const location = useLocation();

  // Show slim disclaimer banner on analyze page and root
  const shouldShowBanner = location.pathname.startsWith('/analyze') || location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background text-ink selection:bg-primary-light selection:text-primary-900">
      {shouldShowBanner && <DisclaimerBanner />}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

