import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProjectsPage } from '@/pages/ProjectsPage';

// El detalle se carga bajo demanda porque arrastra el parser de Markdown.
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/proyectos', element: <ProjectsPage /> },
      { path: '/proyectos/:slug', element: <ProjectDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
