import { Header } from '@/components/chat-header';
import { ResponsiveChatList } from '@/views/chat-list';
import { Outlet } from 'react-router-dom';

export const HomeLayout = () => {
  return (
    <>
      <Header />
      <div className="px-2 pt-2 lg:pt-4">
        <div className="flex h-[calc(100vh-70px)] gap-5 md:h-[calc(100vh-80px)]">
          <section
            aria-label="Chat List"
            className="hidden w-full max-w-xs flex-none md:block xl:max-w-sm"
          >
            <ResponsiveChatList />
          </section>
          <section aria-label="Inbox" className="w-full flex-auto">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
};
