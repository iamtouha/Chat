import { useEffect, useMemo, useRef, useState } from 'react';
import axios from '@/lib/axios';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import socket from '@/socket';
import { cn, timeDifference, useQueryparams } from '@/lib/utils';
import type { Conversation, Message, ResponsePayload } from '@/types';
import { useAlertStore } from '@/store/alertStore';
import { useSocketStore } from '@/store/socketStore';

export const ResponsiveChatList = ({ onSidebar }: { onSidebar?: boolean }) => {
  return onSidebar ? (
    <SheetContent side={'left'} className="p-3">
      <div className="mt-6 flex h-full flex-col">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ChatList type="all" />
          </TabsContent>
          <TabsContent value="starred">
            <ChatList type="starred" />
          </TabsContent>
          <TabsContent value="archived">
            <ChatList type="archived" />
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  ) : (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-3">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ChatList type="all" />
          </TabsContent>
          <TabsContent value="starred">
            <ChatList type="starred" />
          </TabsContent>
          <TabsContent value="archived">
            <ChatList type="archived" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const ChatList = ({ type }: { type: 'starred' | 'archived' | 'all' }) => {
  const [searchText, setSearchText] = useState('');
  const params = useQueryparams();
  const [conversations, setConversations] = useState<
    (Conversation & { messages: Message[] })[]
  >([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messageAlert = useAlertStore((state) => state.alert);
  const socketConnected = useSocketStore((state) => state.connected);
  const activeConversations = useSocketStore(
    (state) => state.activeConversations,
  );
  const setActiveConversations = useSocketStore(
    (state) => state.setActiveConversations,
  );
  const addActiveConversation = useSocketStore(
    (state) => state.addActiveConversation,
  );
  const removeActiveConversation = useSocketStore(
    (state) => state.removeActiveConversation,
  );

  useQuery(
    ['conversations'],
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
    const filtered =
      type === 'all'
        ? conversations.filter((item) => !item.archived)
        : conversations.filter((item) =>
            type === 'starred' ? item.starred : item.archived,
          );
    return filtered
      .sort((a, b) => {
        const aTime = a.messages[0]?.createdAt ?? a.createdAt;
        const bTime = b.messages[0]?.createdAt ?? b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })
      .filter((conv) => {
        return conv.name.toLowerCase().includes(searchText.toLowerCase());
      });
  }, [conversations, searchText, type]);

  useEffect(() => {
    if (!socketConnected) return;
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
      if (messageAlert) {
        audioRef.current?.play();
      }
      setConversations([...conversations]);
    };
    const onJoinConversations = (data: string[]) => {
      setActiveConversations(data);
    };
    const onJoinConversation = (data: string) => {
      addActiveConversation(data);
    };
    const onLeaveConversation = (data: string) => {
      removeActiveConversation(data);
    };

    socket.on('message_received', onMessageReceived);
    socket.on('conversation_started', onConversationStarted);

    socket.on('joined_conversations', onJoinConversations);
    socket.on('joined_conversation', onJoinConversation);
    socket.on('left_conversation', onLeaveConversation);

    return () => {
      socket.off('conversation_started', onConversationStarted);
      socket.off('message_received', onMessageReceived);
      socket.off('joined_conversations', onJoinConversations);
      socket.off('joined_conversation', onJoinConversation);
      socket.on('left_conversation', onLeaveConversation);
    };
  }, [
    conversations,
    messageAlert,
    socketConnected,
    addActiveConversation,
    removeActiveConversation,
    setActiveConversations,
  ]);

  useEffect(() => {
    const currentId = params.get('id');

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentId
          ? {
              ...conv,
              messages: conv.messages.map((msg) => ({ ...msg, seen: true })),
            }
          : conv,
      ),
    );
  }, [params]);

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
      <div className="mb-2 flex w-full flex-initial items-center space-x-2">
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
      <div className="flex-auto space-y-2 overflow-y-auto relative">
        {sortedConversations.length === 0 ? (
          <p className="text-sm text-center mt-2 py-2 rounded-sm bg-muted text-muted-foreground">
            No conversations found
          </p>
        ) : null}
        {sortedConversations.map((conversation) => (
          <ChatCard
            key={conversation.id}
            name={conversation.name}
            text={
              conversation.messages[0]
                ? getSummary(conversation.messages[0])
                : 'started a conversation'
            }
            seen={conversation.messages[0]?.seen ?? false}
            time={conversation.messages[0]?.createdAt ?? conversation.createdAt}
            active={activeConversations.includes(conversation.id)}
            starred={conversation.starred}
            chatId={conversation.id}
          />
        ))}
      </div>
      <div>
        <audio ref={audioRef} className="hidden">
          <source src="/assets/ding.m4a" />
        </audio>
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
  starred,
}: {
  chatId: string;
  active?: boolean;
  name: string;
  text: string;
  time: string;
  seen: boolean;
  starred: boolean;
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
            <div className="flex items-center gap-2">
              {name}
              {starred ? <Icons.star className="h-3 w-3" /> : null}
            </div>
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
