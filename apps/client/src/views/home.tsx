import { Icons } from '@/components/icons';
import { useUserStore } from '@/store/userStore';
import { ResponsiveChatList } from '@/views/chat-list';
import { Outlet } from 'react-router-dom';

export const HomeView = () => {
  const user = useUserStore((state) => state.user);

  if (!user?.active) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <div>
          <Icons.warning className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl text-center">
            Your account is not activated please contact the support.
          </h1>
        </div>
      </div>
    );
  }
  return (
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
  );
};
