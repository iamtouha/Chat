'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input, type InputProps } from '@/components/ui/input';
import { Icons } from '@/components/icons';

const FileInputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const el = ref as React.RefObject<HTMLInputElement>;
    return (
      <div className="relative">
        <Input
          type={'file'}
          className={cn(el?.current?.files?.length ? 'pr-10' : '', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent',
            el?.current?.files?.length ? '' : 'hidden',
          )}
          onClick={() => el.current?.value && (el.current.value = '')}
        >
          <Icons.close className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Remove selected file</span>
        </Button>
      </div>
    );
  },
);
FileInputComponent.displayName = 'FileInput';

export const FileInput = FileInputComponent;
