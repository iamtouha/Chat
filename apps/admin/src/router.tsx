import { createBrowserRouter } from 'react-router-dom';
import { Home } from './views/home';
import { MainLayout } from './components/layouts/main-layout';
import { AuthLayout } from './components/layouts/auth-layout';
import { Login } from './views/login';
import Client from './views/client';

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
          element: <Client />,
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
