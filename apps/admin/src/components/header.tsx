import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-provider';
import { UserButton } from './user-button';

export function Header() {
  return (
    <header className={cn('sticky top-0 z-10 border-b bg-background')}>
      <div className="flex gap-2 px-4 py-2 md:gap-6">
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Innomarkt home">
            <h2 className="text-2xl font-bold">Innomarkt Admin</h2>
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
