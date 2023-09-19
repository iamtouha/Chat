import React from 'react';
import { useLocation } from 'react-router-dom';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useQueryparams() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const timeDifference = (time: Date | string) => {
  const minutes = dayjs().diff(dayjs(time), 'minutes');
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = dayjs().diff(dayjs(time), 'hour');
  if (hours < 24) return `${hours}h`;
  const days = dayjs().diff(dayjs(time), 'day');
  if (days < 7) return `${days}d`;
  const weeks = dayjs().diff(dayjs(time), 'week');
  if (weeks < 52) return `${weeks}w`;
  const years = dayjs().diff(dayjs(time), 'year');
  return `${years}y`;
};
