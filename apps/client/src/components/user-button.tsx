import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useUserStore } from '@/store/userStore';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Icons } from './icons';
import axios from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

export const UserButton = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { mutate: logOut, isLoading } = useMutation(
    ['logout'],
    async () => {
      await axios.post('/api/v1/auth/logout').catch((r) => r);
    },
    {
      onSuccess: () => {
        setUser(null);
        navigate('/auth/login');
      },
    },
  );

  if (!user) return <Navigate to={'/auth/login'}></Navigate>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative">
          {user.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/account">
              <Icons.user className="mr-2 h-4 w-4" aria-hidden="true" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/">
              <Icons.inbox className="mr-2 h-4 w-4" aria-hidden="true" />
              Inbox
            </Link>
          </DropdownMenuItem>
          {user.role === 'ADMIN' ? (
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Icons.gauge className="mr-2 h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={() => logOut()}>
          <p>
            <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
            {isLoading ? 'Sigining out...' : 'Sign out'}
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
