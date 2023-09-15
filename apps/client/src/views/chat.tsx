import { ClientDetails, InboxCard } from '@/components/inbox-card';

export const ChatPage = () => {
  return (
    <div className="flex h-full gap-5">
      <div className="h-full w-full">
        <InboxCard mobileClientDetails={<ClientDetails onSidebar />} />
      </div>
      <div className="hidden w-full max-w-xs xl:block">
        <ClientDetails />
      </div>
    </div>
  );
};
