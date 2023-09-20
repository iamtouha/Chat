import { createBrowserRouter } from 'react-router-dom';
import { HomeLayout } from './views/home';
import { DefaultLayout } from './components/auth-guard';
import { AuthLayout } from './components/layouts/auth-layout';
import { SelectChat } from './components/select-chat';
import { Login } from './views/login';
import { ChatPage } from './views/chat';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <SelectChat />,
          },
          {
            path: '/chat',
            element: <ChatPage />,
          },
        ],
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
