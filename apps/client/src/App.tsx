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
    if (!user?.apiKey) return;
    socket.connect();
    const onSocketConnect = () => {
      console.log('connected');
      socket.emit('user_connected', user.apiKey);
    };
    socket.on('connect', onSocketConnect);
    return () => {
      socket.off('connect', onSocketConnect);
    };
  }, [user?.apiKey]);

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
