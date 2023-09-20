import React from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { timeDifference, useQueryparams, cn } from '@/lib/utils';
import type { Conversation, Message, ResponsePayload } from '@/types';
import socket from '@/socket';

export const ChatPage = () => {
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messageBox = React.useRef<HTMLDivElement>(null);
  const params = useQueryparams();

  const {
    data: conversation,
    isLoading,
    refetch,
  } = useQuery(
    ['conversation', params.get('id')],
    async () => {
      const res = await axios.get<
        ResponsePayload<Conversation & { messages: Message[] }>
      >(`/api/v1/conversations/${params.get('id')}`);
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
    {
      enabled: !!params.get('id'),
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setMessages([...data.messages]);
      },
    },
  );

  const { mutate: sendMessage } = useMutation(
    ['sendmessage', params.get('id'), text],
    async (content: string) => {
      const res = await axios.post<ResponsePayload<Message>>(
        `/api/v1/messages`,
        {
          conversationId: params.get('id'),
          content,
          type: 'INBOUND',
        },
      );
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
    {
      onMutate: (content) => {
        const message: Message = {
          id: Date.now().toString(),
          content,
          type: 'INBOUND',
          createdAt: new Date().toISOString(),
          contentType: 'TEXT',
          seen: false,
          conversationId: conversation?.id ?? '',
        };
        socket.emit('message_sent', message, conversation?.id);
        setMessages((prev) => [...prev, message]);
        setText('');
      },
      onError: () => {
        refetch();
      },
    },
  );

  React.useEffect(() => {
    const onMessageReceived = (message: Message) => {
      if (message.conversationId !== conversation?.id) return;
      setMessages((prev) => [...prev, message]);
    };
    socket.on('message_received', onMessageReceived);
    return () => {
      socket.off('message_received', onMessageReceived);
    };
  }, [conversation?.id]);

  React.useEffect(() => {
    messageBox.current?.scrollTo({
      top: messageBox.current.scrollHeight,
    });
  }, [messages]);

  const lastActive = React.useMemo(() => {
    if (!conversation?.createdAt) return null;
    const time = conversation.messages[0]?.createdAt ?? conversation.createdAt;
    const difference = dayjs().diff(dayjs(time), 'minute');
    if (difference < 3) {
      return 'now';
    }
    return `${timeDifference(time)} ago`;
  }, [conversation]);

  return (
    <div className="flex h-full gap-5">
      <div className="h-full w-full">
        {isLoading ? (
          <div className="h-full grid place-items-center">
            <Icons.spinner className="animate-spin h-10 w-10 text-secondary" />
          </div>
        ) : conversation ? (
          <Card className="relative h-full border-0 shadow-none">
            <CardHeader className="mb-4 flex flex-row items-start space-y-0 border-b p-0 pb-2">
              <div className="flex-auto">
                <CardTitle className="text-lg">{conversation.name}</CardTitle>
                <CardDescription className="text-xs">
                  Active {lastActive}
                </CardDescription>
              </div>
              <div className="flex-initial xl:hidden">
                <Sheet>
                  <SheetTrigger className="rounded-full p-2 transition-colors hover:bg-secondary">
                    <Icons.panelRightOpen className="h-6 w-6" />
                  </SheetTrigger>
                  <ClientDetails conversation={conversation} onSidebar />
                </Sheet>
              </div>
            </CardHeader>
            <CardContent
              ref={messageBox}
              className="space-y-2 overflow-y-auto px-0 absolute inset-x-0 inset-y-14"
            >
              {messages.map((message) => (
                <ConversationText
                  key={message.id}
                  sender={message.type === 'INBOUND'}
                  text={message.content}
                />
              ))}
            </CardContent>
            <CardFooter className="absolute inset-x-0 bottom-0 gap-2 bg-background px-0 py-2">
              <Button variant={'ghost'} className="h-10 w-10 p-2">
                <Icons.attachment className="h-6 w-6" />
              </Button>
              <Button variant={'ghost'} className="h-10 w-10 p-2">
                <Icons.imagePlus className="h-6 w-6" />
              </Button>
              <div className="flex flex-auto items-center gap-1">
                <Input
                  placeholder="Write your text here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button
                  disabled={!text.length}
                  onClick={() => sendMessage(text)}
                >
                  <Icons.sendMessage className="h-6 w-6" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : null}
      </div>
      {conversation ? (
        <div className="hidden w-full max-w-xs xl:block">
          <ClientDetails conversation={conversation} />
        </div>
      ) : null}
    </div>
  );
};

export const ConversationText = ({
  text,
  sender,
}: {
  text: string;
  sender?: boolean;
}) => {
  return (
    <div className={cn('flex', sender ? 'justify-end text-right' : '')}>
      <p
        className={cn(
          'conversation-text w-max  max-w-[max(30vw,300px)] rounded-lg px-3 py-1',
          sender ? 'bg-accent text-accent-foreground' : 'border',
        )}
      >
        {text}
      </p>
    </div>
  );
};

const ClientDetails = ({
  conversation,
  onSidebar,
}: {
  conversation: Conversation;
  onSidebar?: boolean;
}) => {
  return onSidebar ? (
    <SheetContent className="w-[20rem] p-4 pt-6">
      <SheetHeader>
        <SheetTitle className="text-center text-xl font-bold">
          {conversation.name}
        </SheetTitle>
        <SheetDescription className="text-center">
          {conversation.email}
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  ) : (
    <Card className={cn('h-full')}>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          {conversation.name}
        </CardTitle>
        <CardDescription className="text-center">
          {conversation.email}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
