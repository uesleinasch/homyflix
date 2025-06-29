import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../core/hooks/useAuth";
import {
  AppShell,
  Burger,
  Group,
  Text,
  Stack,
  NavLink,
  Avatar,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  FilmStripIcon,
  PlusIcon,
  User,
  SignOutIcon,
  HouseIcon,
  GearIcon,
  CaretRightIcon,
  HeartIcon,

} from "@phosphor-icons/react";
import styles from "./style.module.css";
import HexagonMenuItem from "./components/hexagonalItems/HexagonalMenu";




const MainLayout: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const navigationItems = [
    {
      icon: <HouseIcon size={28} weight="fill" />,
      label: "Home",
      href: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      icon: <FilmStripIcon size={28} weight="fill" />,
      label: "Filmes",
      href: "/movies",
      active: location.pathname === "/movies",
    },
    {
      icon: <PlusIcon size={28} weight="fill" />,
      label: "Adicionar",
      href: "/movies/create",
      active: location.pathname === "/movies/create" || (location.pathname.includes("/movies/") && location.pathname.includes("/edit")),
    },
    {
      icon: <HeartIcon size={28} weight="fill" />,
      label: "Favoritos",
      href: "/favorites",
      active: location.pathname === "/favorites",
    },


  ];

  const desktopNavigationItems = navigationItems;

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      miw={"100%"}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text 
              size="xl" 
              fw={800} 
              c="orange"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/dashboard")}
            >
              HoMyFlix
            </Text>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <Avatar size="sm" radius="xl" name={user?.name} color="orange">
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{user?.name}</Menu.Label>
              <Menu.Item
                leftSection={<User size={16} />}
                onClick={() => navigate("/profile")}
              >
                Perfil
              </Menu.Item>
              <Menu.Item
                leftSection={<GearIcon size={16} />}
                onClick={() => navigate("/settings")}
              >
                Configurações
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<SignOutIcon size={16} />}
                color="red"
                onClick={handleLogout}
              >
                Sair
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {isMobile ? (
          <div className={styles.mobileMenuGrid}>
            {navigationItems.map((item) => (
              <HexagonMenuItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                active={item.active}
                onClick={() => {
                  navigate(item.href);
                  if (opened) {
                    toggle();
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <Stack gap="xs">
            {desktopNavigationItems.map((item) => (
              <NavLink
                style={{
                  backgroundColor: item.active ? 'var(  --primary-500)' : 'var(--neutral-50)',
                  color: item.active ? 'var(--neutral-50)' : 'var(--neutral-700)',
                }}
                color="orange"
                key={item.href}
                href={item.href}
                label={item.label}
                leftSection={item.icon}
                rightSection={<CaretRightIcon size={16} />}
                active={item.active}
                variant="filled"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.href);
                  if (opened) {
                    toggle();
                  }
                }}
              />
            ))}
          </Stack>
        )}
      </AppShell.Navbar>

      <AppShell.Main style={{ flex: "1", overflow: "auto", width: "100%" }} bg={'var(--neutral-50)'}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
