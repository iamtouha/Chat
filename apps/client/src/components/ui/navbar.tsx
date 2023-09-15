import {
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  //   NavbarMenuToggle,
  //   NavbarMenu,
  //   NavbarMenuItem,
} from '@nextui-org/react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <NextNavbar maxWidth="full">
      <NavbarBrand className="max-w-min">
        <p className="font-bold text-lg mr-4 text-inherit">Innomarkt Chat</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link color="foreground" to="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" to="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link to="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
};
