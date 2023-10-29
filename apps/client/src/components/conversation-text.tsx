import { cn, getFilename } from '@/lib/utils';
import { Message } from '@/types';
import { Icons } from './icons';
import { Button } from './ui/button';
import dayjs from 'dayjs';

export const ConversationText = ({
  content,
  type,
  sender,
  local,
  time,
}: {
  content: string;
  type: Message['contentType'];
  sender?: boolean;
  local?: boolean;
  time: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-end gap-1',
        sender ? 'flex-row-reverse text-right' : '',
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      {
        {
          TEXT: (
            <p
              className={cn(
                'conversation-text w-max  max-w-[max(30vw,300px)] rounded-lg px-3 py-1',
                sender ? 'bg-accent text-accent-foreground' : 'border',
              )}
            >
              {content}
            </p>
          ),
          IMAGE: local ? (
            <p
              className={cn(
                'conversation-text flex items-center h-11 w-max max-w-[max(30vw,300px)] rounded-lg px-3 py-1',
                sender ? 'bg-accent text-accent-foreground' : 'border',
              )}
            >
              <span>you {sender ? 'sent' : 'received'} an image</span>
            </p>
          ) : (
            <img
              className={cn(
                'w-max max-w-[max(30vw,300px)] max-h-[300px] h-full object-contain border rounded-lg',
              )}
              src={content}
            />
          ),
          FILE: (
            <div
              className={cn(
                'conversation-text flex items-center h-11 w-max max-w-[max(30vw,300px)] rounded-lg px-3 py-1',
                sender ? 'bg-accent text-accent-foreground' : 'border',
              )}
            >
              <Icons.file className="h-6 max-w-[24px] w-full inline-block mr-2" />
              {local ? (
                <span>you {sender ? 'sent' : 'received'} a file</span>
              ) : (
                <p className={'text-left line-clamp-1'}>
                  {getFilename(content)}
                </p>
              )}

              <a href={content}>
                {local ? null : (
                  <Button variant={'ghost'} size={'sm'} className="py-0">
                    <Icons.downlaod className="h-5 w-5" />
                  </Button>
                )}
              </a>
            </div>
          ),
          AUDIO: '',
          VIDEO: '',
        }[type]
      }
      <p className="text-xs mb-1 text-muted-foreground">
        {dayjs(time).format('hh:mm a')}
      </p>
    </div>
  );
};
