import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './components/theme-provider';
import { router } from './router';

const queryClient = new QueryClient();

function App() {
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
