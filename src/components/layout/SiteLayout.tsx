import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { Spinner } from '@/components/ui/Spinner';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

/** Hace scroll al ancla (/#contacto) al navegar, cosa que React Router no hace solo. */
function useHashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname]);
}

export function SiteLayout() {
  useHashScroll();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <Spinner />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
