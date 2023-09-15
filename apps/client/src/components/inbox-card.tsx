import React from 'react';
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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export const InboxCard = ({
  mobileClientDetails,
}: {
  mobileClientDetails: React.ReactNode;
}) => {
  return (
    <Card className="relative h-full border-0 shadow-none">
      <CardHeader className="mb-4 flex flex-row items-start space-y-0 border-b p-0 pb-2">
        <div className="flex-auto">
          <CardTitle className="text-lg">John Doe</CardTitle>
          <CardDescription className="text-xs">
            Active 2 hours ago
          </CardDescription>
        </div>
        <div className="flex-initial xl:hidden">
          <Sheet>
            <SheetTrigger className="rounded-full p-2 transition-colors hover:bg-secondary">
              <Icons.panelRightOpen className="h-6 w-6" />
            </SheetTrigger>
            {mobileClientDetails}
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 overflow-y-auto px-0">
        <ConversationText text="Good morning. how are you doing? hope you're well. Did you launch a new product yesterday?" />
        <ConversationText sender text="Good morning. How can I help you?" />
      </CardContent>
      <CardFooter className="absolute inset-x-0 bottom-0 gap-2 bg-background px-0 py-2">
        <Button variant={'ghost'} className="h-10 w-10 p-2">
          <Icons.attachment className="h-6 w-6" />
        </Button>
        <Button variant={'ghost'} className="h-10 w-10 p-2">
          <Icons.imagePlus className="h-6 w-6" />
        </Button>
        <div className="flex flex-auto items-center gap-1">
          <Input placeholder="Write your text here" />
          <Button>
            <Icons.sendMessage className="h-6 w-6" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ConversationText = ({
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

export const ClientDetails = ({ onSidebar }: { onSidebar?: boolean }) => {
  return onSidebar ? (
    <SheetContent className="w-[20rem] p-4 pt-6">
      <SheetHeader>
        <SheetTitle className="text-center text-xl font-bold">
          John Doe
        </SheetTitle>
        <SheetDescription className="text-center">
          touha98@gmail.com
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  ) : (
    <Card className={cn('h-full')}>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          John Doe
        </CardTitle>
        <CardDescription className="text-center">
          touha98@gmail.com
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
