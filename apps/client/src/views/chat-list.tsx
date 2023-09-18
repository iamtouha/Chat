import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SheetContent } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { ChatCard } from '@/components/chat-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { Conversation, Message, ResponsePayload } from '@/types';
import { useEffect } from 'react';
import socket from '@/socket';

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
  const { data: conversations, refetch } = useQuery(
    ['chats'],
    async () => {
      const res = await axios.get<
        ResponsePayload<(Conversation & { messages: Message[] })[]>
      >('/api/v1/conversations');
      if (res.data.status !== 'success') {
        throw new Error(res.data?.message);
      }
      return res.data.result.sort((a, b) => {
        const aDate = a.messages[0]?.createdAt ?? a.createdAt;
        const bDate = b.messages[0]?.createdAt ?? b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    },
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    const onConversationStarted = () => {
      refetch();
    };
    socket.on('conversation_started', onConversationStarted);
    return () => {
      socket.off('conversation_started', onConversationStarted);
    };
  }, [refetch]);

  const getSummary = (message: Message) => {
    let str = message.type === 'INBOUND' ? 'You : ' : '';
    switch (message.contentType) {
      case 'AUDIO':
        str += 'sent an audio';
        break;
      case 'IMAGE':
        str += 'sent an image';
        break;
      case 'VIDEO':
        str += 'sent a video';
        break;
      case 'FILE':
        str += 'sent a file';
        break;
      case 'TEXT':
        str += message.content;
        break;
    }
    return str;
  };

  return (
    <>
      <div className="mb-6 flex w-full flex-initial items-center space-x-2">
        <Input type="text" placeholder="Search Client" />
        <Button variant="outline">
          <Icons.search className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-auto space-y-2 overflow-y-auto pb-4 relative">
        {conversations?.map((conversation) => (
          <ChatCard
            key={conversation.id}
            name={conversation.name}
            text={
              conversation.messages[0]
                ? getSummary(conversation.messages[0])
                : 'started a conversation'
            }
            seen={true}
            time={conversation.messages[0]?.createdAt ?? conversation.createdAt}
            chatId={conversation.id}
          />
        ))}
      </div>
    </>
  );
};
