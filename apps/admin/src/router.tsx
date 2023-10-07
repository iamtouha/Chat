import { createBrowserRouter } from 'react-router-dom';
import { Home } from './views/home';
import { MainLayout } from './components/layouts/main-layout';
import { AuthLayout } from './components/layouts/auth-layout';
import { Login } from './views/login';
import { ClientView } from './views/client';
import { NewClient } from './views/new-client';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/client',
          element: <ClientView />,
        },
        {
          path: '/new-client',
          element: <NewClient />,
        },
      ],
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
  ],
  {
    basename: '/admin',
  },
);
