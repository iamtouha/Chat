import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-provider';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { ResponsiveChatList } from '@/views/chat-list';
import { UserButton } from './user-button';

export function Header() {
  return (
    <header className={cn('sticky top-0 z-10 border-b bg-background')}>
      <div className="flex gap-2 px-4 py-2 md:gap-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden">
              <Icons.alignLeft className="h-6 w-6" />
            </SheetTrigger>
            <ResponsiveChatList onSidebar />
          </Sheet>
          <Link to="/" aria-label="Innomarkt home">
            <h2 className="text-2xl font-bold">Innomarkt</h2>
          </Link>
        </div>
        <div className="ml-0 mr-auto"></div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
