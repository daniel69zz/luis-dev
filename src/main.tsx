import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/index.css';

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Spinner } from '@/components/ui/Spinner';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center">
          <Spinner />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);
