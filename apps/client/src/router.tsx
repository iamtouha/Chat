import { createHashRouter } from 'react-router-dom';
import { HomeLayout } from './views/home';
import { DefaultLayout } from './components/layouts/default-layout';
import { AuthLayout } from './components/layouts/auth-layout';
import { SelectChat } from './components/select-chat';
import { Login } from './views/login';
import { ChatPage } from './views/chat';
import { AdminLayout } from './components/layouts/admin-layout';
import { Dashboard } from './views/admin/dashboard';
import { ClientView } from './views/admin/client';
import { NewClient } from './views/admin/new-client';
import { UpdateClient } from './views/admin/update-client';

export const router = createHashRouter([
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
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'client', element: <ClientView /> },
          { path: 'new-client', element: <NewClient /> },
          { path: 'update-client', element: <UpdateClient /> },
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
