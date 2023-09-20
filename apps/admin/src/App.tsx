import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './components/theme-provider';
import { useUserStore } from './store/userStore';
import { router } from './router';
import { useEffect } from 'react';
import socket from './socket';

const queryClient = new QueryClient();

function App() {
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (!user?.id) return;
    socket.connect();
    const onSocketConnect = () => {
      socket.emit('user_connected', user?.id);
    };
    socket.on('connect', onSocketConnect);
    return () => {
      socket.off('connect', onSocketConnect);
    };
  }, [user?.id]);

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <ToastContainer />
    </main>
  );
}

export default App;
