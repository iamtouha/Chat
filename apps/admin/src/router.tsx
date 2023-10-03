import { createBrowserRouter } from 'react-router-dom';
import { Home } from './views/home';
import { MainLayout } from './components/layouts/main-layout';
import { AuthLayout } from './components/layouts/auth-layout';
import { Login } from './views/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
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
]);
