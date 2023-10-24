import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-provider';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { ResponsiveChatList } from '@/views/chat-list';
import { UserButton } from './user-button';
import { Button } from './ui/button';
import { useAlertStore } from '@/store/alertStore';
import { useUserStore } from '@/store/userStore';

export function Header() {
  const user = useUserStore((state) => state.user);
  const alert = useAlertStore((state) => state.alert);
  const setAlert = useAlertStore((state) => state.setAlert);
  return (
    <header className={cn('sticky top-0 z-10 border-b bg-background')}>
      <div className="flex px-2 sm:px-4 py-2 md:gap-6">
        <div className="flex items-center gap-2">
          {user?.active ? (
            <Sheet>
              <SheetTrigger className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden">
                <Icons.alignLeft className="h-6 w-6" />
              </SheetTrigger>
              <ResponsiveChatList onSidebar />
            </Sheet>
          ) : null}
          <Link to="/" aria-label="Innomarkt home">
            <h2 className="text-xl lg:text-2xl font-bold leading-none">
              Innomarkt
            </h2>
          </Link>
        </div>
        <div className="ml-0 mr-auto"></div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="w-9 px-0"
            onClick={() => setAlert(!alert)}
          >
            {alert ? (
              <Icons.volumne className="w-5 h-5" />
            ) : (
              <Icons.volumneMute className="w-5 h-5" />
            )}
          </Button>
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
