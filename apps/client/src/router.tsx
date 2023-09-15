import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { DefaultLayout } from './components/layouts/default-layout';
import { AuthLayout } from './components/layouts/auth-layout';
import { Login } from './pages/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        index: true,
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
