import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SheetContent } from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import socket from '@/socket';
import { cn, timeDifference, useQueryparams } from '@/lib/utils';
import type { Conversation, Message, ResponsePayload } from '@/types';

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
  const [searchText, setSearchText] = useState('');
  const [conversations, setConversations] = useState<
    (Conversation & { messages: Message[] })[]
  >([]);

  useQuery(
    ['chats'],
    async () => {
      const res = await axios.get<
        ResponsePayload<(Conversation & { messages: Message[] })[]>
      >('/api/v1/conversations');
      if (res.data.status !== 'success') {
        throw new Error(res.data?.message);
      }
      return res.data.result;
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setConversations(data);
      },
    },
  );

  const sortedConversations = useMemo(() => {
    return conversations
      .sort((a, b) => {
        const aTime = a.messages[0]?.createdAt ?? a.createdAt;
        const bTime = b.messages[0]?.createdAt ?? b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })
      .filter((conv) => {
        return conv.name.toLowerCase().includes(searchText.toLowerCase());
      });
  }, [conversations, searchText]);

  useEffect(() => {
    const onConversationStarted = (
      data: Conversation & { messages: Message[] },
    ) => {
      setConversations((prev) => [...prev, data]);
    };
    const onMessageReceived = (message: Message) => {
      const conv = conversations.find((c) => c.id === message.conversationId);
      if (conv) {
        conv.messages.unshift(message);
      }
      setConversations([...conversations]);
    };
    socket.on('message_received', onMessageReceived);
    socket.on('conversation_started', onConversationStarted);
    return () => {
      socket.off('conversation_started', onConversationStarted);
      socket.off('message_received', onMessageReceived);
    };
  }, [conversations]);

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
        <Input
          type="text"
          placeholder="Search Client"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="ghost" disabled className="cursor-default">
          <Icons.search className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-auto space-y-2 overflow-y-auto pb-4 relative">
        {sortedConversations.map((conversation) => (
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

export const ChatCard = ({
  chatId,
  name,
  text,
  time,
  seen,
  active,
}: {
  chatId: string;
  active?: boolean;
  name: string;
  text: string;
  time: string;
  seen: boolean;
}) => {
  const params = useQueryparams();
  const timeDiff = useMemo(() => timeDifference(time), [time]);

  return (
    <Link to={`/chat?id=${chatId}`} className="block">
      <Card
        className={cn(
          'relative cursor-pointer border-0 shadow-none transition-colors hover:bg-accent hover:text-accent-foreground',
          chatId === params.get('id') ? 'bg-accent text-accent-foreground' : '',
        )}
      >
        <CardHeader className="relative space-y-0 px-3 py-2">
          <CardTitle
            className={cn(
              'text-base',
              seen ? '' : 'chat-not-seen',
              active ? 'chat-active' : '',
            )}
          >
            {name}
          </CardTitle>
          <CardDescription className={cn('flex text-xs')}>
            <span className={cn('line-clamp-1', seen ? '' : 'font-bold')}>
              {text}
            </span>
            <span className="min-w-[36px]">&nbsp;·&nbsp;{timeDiff}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
