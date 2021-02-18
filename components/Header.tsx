import NextLink from "next/link";
import { useRouter } from "next/router";

import { useStoreActions, Actions, useStoreState } from "easy-peasy";

import { StoreModel } from "../store";
import {
  Link,
  Image,
  LinkProps,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Button,
} from "@chakra-ui/core";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const setShowLoginModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setShowLoginModal
  );
  const setShowRegistrationModal = useStoreActions(
    (actions: Actions<StoreModel>) => actions.modals.setShowRegistrationModal
  );
  const setUser = useStoreActions(
    (actions: Actions<StoreModel>) => actions.user.setUser
  );
  const user = useStoreState((state: StoreModel) => state.user.user);

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(undefined);
  };

  const navLinkProps: LinkProps = {
    display: "block",
    mr: "15px",
    color: "#333",
    textDecoration: "none",
  };

  const renderAccountMenu = (
    <Menu>
      <MenuButton as={Button} _focus={undefined}>
        {user}
      </MenuButton>
      <MenuList
        border="none"
        borderRadius="10px"
        padding="8px 0"
        lineHeight="20px"
        placement="top-end"
        maxWidth="280px"
        backgroundColor="white"
        _hover={undefined}
      >
        <Button
          onClick={() => router.push("/host")}
          _focus={{ outline: "none" }}
          bg="white"
          _active={undefined}
        >
          Your houses
        </Button>
        <Button
          onClick={() => router.push("/host/new")}
          _focus={{ outline: "none" }}
          bg="white"
          _active={undefined}
        >
          Add new house
        </Button>
        <Button
          onClick={() => router.push("/bookings")}
          _focus={{ outline: "none" }}
          bg="white"
          _active={undefined}
        >
          Bookings
        </Button>

        <Button
          onClick={logout}
          mt="5px"
          _focus={{ outline: "none" }}
          bg="white"
          _active={undefined}
        >
          Logout
        </Button>
      </MenuList>
    </Menu>
  );
  return (
    <Flex
      height="50px"
      borderBottom="1px solid #eee"
      alignItems="center"
      flexDir="row"
      justify="space-between"
    >
      <NextLink href="/" passHref>
        <Link src="/img/logo.png" {...navLinkProps} _focus={undefined}>
          <Image src="/img/logo.png" />
        </Link>
      </NextLink>

      <Flex flexDir="row" alignItems="center">
        {user ? (
          renderAccountMenu
        ) : (
          <>
            <Link {...navLinkProps} onClick={() => setShowRegistrationModal()}>
              <Text color="gray.600" fontWeight="bold" fontSize="18px">
                Sign Up
              </Text>
            </Link>
            <Link {...navLinkProps} onClick={() => setShowLoginModal()}>
              <Text color="gray.600" fontWeight="bold" fontSize="18px">
                Log In
              </Text>
            </Link>{" "}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
