'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChatCard } from '@/components/chat-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SheetContent } from '@/components/ui/sheet';

export const ResponsiveChatList = ({ onSidebar }: { onSidebar?: boolean }) => {
  return onSidebar ? (
    <SheetContent side={'left'} className="p-4">
      <div className="mt-6 flex h-full flex-col">
        <ChatList />
      </div>
    </SheetContent>
  ) : (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-4">
        <ChatList />
      </CardContent>
    </Card>
  );
};

const ChatList = () => {
  return (
    <>
      <div className="mb-6 flex w-full flex-initial items-center space-x-2">
        <Input type="text" placeholder="Search Client" />
        <Button variant="outline">
          <Icons.search className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-auto space-y-2 overflow-y-auto pb-4">
        <ChatCard
          name="Touha Zohair"
          text="Hi. What's the price of your product?"
          seen={true}
          time="2023-7-29"
          chatId="1"
          active
        />
        <ChatCard
          name="John Doe"
          text="Is your new product releasing?"
          seen={false}
          time="2023-7-25"
          chatId="2"
        />
        <ChatCard
          name="Jane Doe"
          text="I received the product. It's great!"
          seen={true}
          time="2023-7-22"
          chatId="4"
        />
      </div>
    </>
  );
};
