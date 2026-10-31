import React, { useEffect } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from '../pages/Home';
import { Analyze } from '../pages/Analyze';
import { HowItWorks } from '../pages/HowItWorks';
import { FAQ } from '../pages/FAQ';
import { About } from '../pages/About';
import { Privacy } from '../pages/Privacy';
import { Disclaimer } from '../pages/Disclaimer';
import { NotFound } from '../pages/NotFound';

// Scroll to top on route navigation
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'analyze',
        element: <Analyze />,
      },
      {
        path: 'how-it-works',
        element: <HowItWorks />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'disclaimer',
        element: <Disclaimer />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

