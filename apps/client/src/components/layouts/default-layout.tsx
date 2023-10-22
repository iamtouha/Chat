import { Header } from '@/components/chat-header';
import type { ReactNode } from 'react';

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="px-2 pt-2 lg:pt-4">{children}</div>
    </>
  );
};
