import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { DefaultLayout } from './components/layouts/default-layout';

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
]);
