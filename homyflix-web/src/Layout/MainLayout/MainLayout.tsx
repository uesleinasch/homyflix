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
import { useDisclosure } from "@mantine/hooks";
import {
  FilmStripIcon,
  PlusIcon,
  User,
  SignOutIcon,
  HouseIcon,
  GearIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

const MainLayout: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const navigationItems = [
    {
      icon: <HouseIcon size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      icon: <FilmStripIcon size={20} />,
      label: "Meus Filmes",
      href: "/movies",
      active: location.pathname === "/movies",
    },
    {
      icon: <PlusIcon size={20} />,
      label: "Adicionar Filme",
      href: "/movies/create",
      active: location.pathname === "/movies/create" || location.pathname.includes("/movies/") && location.pathname.includes("/edit"),
    },
  ];

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
              fw={700} 
              c="blue"
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
        <Stack gap="xs">
          {navigationItems.map((item) => (
            <NavLink
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
      </AppShell.Navbar>

      <AppShell.Main style={{ flex: "1", overflow: "auto", width: "100%" }} bg={'var(--neutral-50)'}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
