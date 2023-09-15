import {
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

export const Navbar = () => {
  const user = useUserStore((state) => state.user);

  return (
    <NextNavbar maxWidth="full">
      <NavbarBrand className="max-w-min">
        <p className="font-bold text-lg mr-4 text-inherit">Innomarkt Chat</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button color="primary" variant="flat">
              {user?.username}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem className="p-0">
              <Button variant="light" fullWidth as={Link} to={'/profile'}>
                Profile
              </Button>
            </DropdownItem>
            <DropdownItem className="p-0">
              <Button variant="light" fullWidth>
                Log out
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NextNavbar>
  );
};
