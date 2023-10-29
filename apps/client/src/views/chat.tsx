import React from 'react';
import dayjs from 'dayjs';
import axios from '@/lib/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { timeDifference, useQueryparams } from '@/lib/utils';
import type { Conversation, FileData, Message, ResponsePayload } from '@/types';
import socket from '@/socket';
import { toast } from 'react-toastify';
import { FileCard } from '@/components/file-card';
import { useUserStore } from '@/store/userStore';
import { useSocketStore } from '@/store/socketStore';
import { ConversationPanel } from '@/components/conversation-panel';
import { ConversationText } from '@/components/conversation-text';

const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'pdf', 'docx', 'csv', 'xlsm'];

export const ChatPage = () => {
  const params = useQueryparams();
  const user = useUserStore((state) => state.user);
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isActive = useSocketStore((state) => state.isConversationActive);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return void toast.error('Invalid file type');
    }
    setSelectedFile(file);
  };
  const { mutate: makeSeen } = useMutation(
    ['seen-message', messages[0]?.id],
    async (id: string) => {
      const res = await axios.put(`/api/v1/messages/${id}/seen`);
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
  );

  const { data: conversation, isLoading } = useQuery(
    ['conversations', params.get('id')],
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
    ['sendmessage', params.get('id'), text, user?.apiKey],
    async ({
      content,
      file,
    }: {
      content: string;
      file: File | null;
      key: string;
    }) => {
      if (!user) throw new Error('User not found');
      let fileId: number | null = null;
      let contentUrl: string | null = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('apiKey', user.apiKey);
        const res = await axios.post<ResponsePayload<FileData>>(
          `/api/v1/files/upload`,
          formData,
        );
        if (res.data.status !== 'success') {
          throw new Error(res.data.message);
        }

        fileId = res.data.result.id;
        contentUrl = res.data.result.location;
      }
      const contentType = file?.type.startsWith('image/')
        ? 'IMAGE'
        : file
        ? 'FILE'
        : 'TEXT';
      const res = await axios.post<ResponsePayload<Message>>(
        `/api/v1/messages`,
        {
          conversationId: params.get('id'),
          content: contentUrl ?? content,
          fileId: fileId ?? undefined,
          contentType,
          type: 'INBOUND',
        },
      );
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
    {
      onMutate: (payload) => {
        if (payload.file) {
          setSelectedFile(null);
          fileInputRef.current?.value && (fileInputRef.current.value = '');
        }
        const content = payload.file?.type.startsWith('image/')
          ? URL.createObjectURL(payload.file)
          : payload.file?.name ?? payload.content;

        const contentType = payload.file?.type.startsWith('image/')
          ? 'IMAGE'
          : payload.file
          ? 'FILE'
          : 'TEXT';
        const message: Message = {
          id: payload.key,
          local: true,
          content,
          type: 'INBOUND',
          createdAt: new Date().toISOString(),
          contentType,
          seen: false,
          conversationId: conversation?.id ?? '',
        };
        socket.emit('message_sent', message, conversation?.id);
        setMessages((prev) => [message, ...prev]);
        setText('');
      },
      onSuccess: (data, { key }) => {
        socket.emit('message_update_sent', data, key);
        setMessages((prev) =>
          prev.map((message) => (message.id === key ? data : message)),
        );
      },
      onError: () => {
        setMessages((prev) => prev.slice(0, -1));
      },
    },
  );

  React.useEffect(() => {
    const onMessageReceived = (message: Message) => {
      if (message.conversationId !== conversation?.id) return;
      setMessages((prev) => [message, ...prev]);
    };
    const onMessageUpdated = (message: Message, key: string) => {
      if (message.conversationId !== conversation?.id) return;
      setMessages((prev) => prev.map((m) => (m.id === key ? message : m)));
    };
    socket.on('message_received', onMessageReceived);
    socket.on('message_updated', onMessageUpdated);
    return () => {
      socket.off('message_received', onMessageReceived);
      socket.off('message_updated', onMessageUpdated);
    };
  }, [conversation?.id]);
  React.useEffect(() => {
    if (!messages.length) return;
    const { local, seen, id } = messages[0];
    if (local || seen) return;
    makeSeen(id);
  }, [messages, makeSeen]);

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
          <Card className="relative h-full border-0 shadow-none grid gap-1 grid-rows-[56px,auto,56px]">
            <CardHeader className="flex flex-row items-start space-y-0 border-b p-0">
              <div className="flex-auto">
                <CardTitle className="text-lg">{conversation.name}</CardTitle>
                <CardDescription className="text-xs">
                  {isActive(conversation.id)
                    ? 'Active now'
                    : `Active ${lastActive}`}
                </CardDescription>
              </div>
              <div className="flex-initial xl:hidden">
                <Sheet>
                  <SheetTrigger className="rounded-full p-2 transition-colors hover:bg-secondary">
                    <Icons.panelRightOpen className="h-6 w-6" />
                  </SheetTrigger>
                  <ConversationPanel conversation={conversation} onSidebar />
                </Sheet>
              </div>
            </CardHeader>
            <CardContent className="gap-2 overflow-y-auto px-0 flex flex-col-reverse">
              {messages.map((message) => (
                <ConversationText
                  key={message.id}
                  sender={message.type === 'INBOUND'}
                  type={message.contentType}
                  content={message.content}
                  local={message.local}
                  time={message.createdAt}
                />
              ))}
            </CardContent>
            <CardFooter className="gap-2 bg-background px-0 py-2">
              <Button
                variant={'ghost'}
                className="h-10 w-10 p-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icons.imagePlus className="h-6 w-6" />
              </Button>
              <div className="flex flex-auto items-center gap-1">
                {selectedFile ? (
                  <FileCard
                    file={selectedFile}
                    onClose={() => {
                      setSelectedFile(null);
                      fileInputRef.current?.value &&
                        (fileInputRef.current.value = '');
                    }}
                  />
                ) : null}

                <Input
                  className={selectedFile ? 'hidden' : ''}
                  placeholder="Write your text here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <input
                  className="hidden"
                  ref={fileInputRef}
                  type="file"
                  accept=".png, .jpeg, .pdf, .docx, .csv, .xlsm"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() =>
                    sendMessage({
                      content: text,
                      file: selectedFile,
                      key: Date.now().toString(),
                    })
                  }
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
          <ConversationPanel conversation={conversation} />
        </div>
      ) : null}
    </div>
  );
};
