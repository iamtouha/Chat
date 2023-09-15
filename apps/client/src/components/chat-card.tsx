import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, useQueryparams } from '@/lib/utils';

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
  const timeDiff = React.useMemo(() => {
    const minutes = dayjs().diff(dayjs(time), 'minutes');
    if (minutes < 60) return `${minutes}m`;
    const hours = dayjs().diff(dayjs(time), 'hour');
    if (hours < 24) return `${hours}h`;
    const days = dayjs().diff(dayjs(time), 'day');
    if (days < 7) return `${days}d`;
    const weeks = dayjs().diff(dayjs(time), 'week');
    if (weeks < 52) return `${weeks}w`;
    const years = dayjs().diff(dayjs(time), 'year');
    return `${years}y`;
  }, [time]);
  return (
    <Link to={`/chat?id=${chatId}`} className="block">
      <Card
        className={cn(
          'relative cursor-pointer border-0 shadow-none transition-colors hover:bg-accent hover:text-accent-foreground',
          chatId === params.get('chatId')
            ? 'bg-accent text-accent-foreground'
            : '',
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
