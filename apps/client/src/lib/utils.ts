import React from 'react';
import { useLocation } from 'react-router-dom';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useQueryparams() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
