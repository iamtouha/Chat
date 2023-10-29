import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Conversation, FileData, ResponsePayload } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SidebarFileCard } from './file-card';
import { toast } from 'react-toastify';

export const ConversationPanel = ({
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
      <PanelContent
        conversationId={conversation.id}
        starred={conversation.starred}
        archived={conversation.archived}
      />
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
        <CardContent className="px-0">
          <PanelContent
            conversationId={conversation.id}
            starred={conversation.starred}
            archived={conversation.archived}
          />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

const PanelContent = ({
  conversationId,
  starred,
  archived,
}: {
  conversationId: string;
  starred: boolean;
  archived: boolean;
}) => {
  const queryClient = useQueryClient();
  const setStar = useMutation(
    ['star', conversationId, starred],
    async () => {
      const res = await axios.post<ResponsePayload<Conversation>>(
        `/api/v1/conversations/${conversationId}/star`,
        { starred: !starred },
      );
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['conversations']);
        if (data.starred) {
          toast.success('Conversation starred');
          return;
        }
        toast.success('Conversation unstarred');
      },
    },
  );
  const setArchive = useMutation(
    ['archive', conversationId, archived],
    async () => {
      const res = await axios.post<ResponsePayload<Conversation>>(
        `/api/v1/conversations/${conversationId}/archive`,
        { archived: !archived },
      );
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      return res.data.result;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['conversations']);
        if (data.archived) {
          toast.success('Conversation archived');
          return;
        }
        toast.success('Conversation unarchived');
      },
    },
  );
  const filesQuery = useQuery(['files', conversationId], async () => {
    const filesRes = await axios.get<ResponsePayload<FileData[]>>(
      `/api/v1/files?conversationId=${conversationId}`,
    );
    if (filesRes.data.status !== 'success') {
      throw new Error(filesRes.data.message);
    }
    return filesRes.data.result;
  });

  return (
    <>
      <div className="flex justify-center py-2 gap-4">
        <Button
          size={'sm'}
          variant={'outline'}
          disabled={setStar.isLoading}
          aria-label="star conversation"
          onClick={() => setStar.mutate()}
        >
          {starred ? (
            <>
              <Icons.starOff className="h-5 w-5" />
              &nbsp;Unstar
            </>
          ) : (
            <>
              <Icons.star className="h-5 w-5" />
              &nbsp;Star
            </>
          )}
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          disabled={setArchive.isLoading}
          aria-label="archive conversation"
          onClick={() => setArchive.mutate()}
        >
          {archived ? (
            <>
              <Icons.archiveX className="h-5 w-5" />
              &nbsp;Unarchive
            </>
          ) : (
            <>
              <Icons.archive className="h-5 w-5" />
              &nbsp;Archive
            </>
          )}
        </Button>
      </div>
      <div>
        <h2 className="font-bold mb-2 mt-4">Files in conversation</h2>

        {filesQuery.data?.length === 0 ? (
          <p className="text-sm text-center mt-2 py-2 rounded-sm bg-muted text-muted-foreground">
            No files found
          </p>
        ) : null}
        {filesQuery.isLoading ? <p className="text-sm">Loading...</p> : null}
        {filesQuery.data?.length ? (
          <div className="h-[28rem] lg:h-[25rem] overflow-y-auto">
            {filesQuery.data.map((file) => (
              <SidebarFileCard
                key={file.id}
                name={file.name}
                src={file.location}
                type={file.mimeType}
              ></SidebarFileCard>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};
