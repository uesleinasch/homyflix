import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../core/hooks/useAuth";
import {
  Group,
  Text,
  Button,
  Stack,
  ActionIcon,
  Badge,
  Card,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { FilmStripIcon, PlusIcon, CaretRightIcon } from "@phosphor-icons/react";
import MantineContainer from "../../shared/components/ui/mantineContainer/MantineContainer";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Meus Filmes",
      description: "Visualizar e gerenciar todos os filmes cadastrados",
      icon: <FilmStripIcon size={24} />,
      href: "/movies",
      color: "orange",
    },
    {
      title: "Adicionar Filme",
      description: "Cadastrar um novo filme na sua biblioteca",
      icon: <PlusIcon size={24} />,
      href: "/movies/create",
      color: "orange",
    },
  ];

  return (
    <MantineContainer miw={"100%"}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} size="h2">
              Dashboard
            </Title>
            <Text c="dimmed" size="sm">
              Bem-vindo de volta, {user?.name}!
            </Text>
          </div>
          <Badge variant="light" color="green" size="lg">
            Online
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {dashboardCards.map((card) => (
            <Card
              key={card.href}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              component={Link}
              to={card.href}
              style={{
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text fw={500} size="lg">
                  {card.title}
                </Text>
                <ActionIcon variant="light" color={card.color} size="lg">
                  {card.icon}
                </ActionIcon>
              </Group>

              <Text size="sm" c="dimmed">
                {card.description}
              </Text>

              <Button
                variant="light"
                color={card.color}
                fullWidth
                mt="md"
                radius="md"
                rightSection={<CaretRightIcon size={16} />}
              >
                Acessar
              </Button>
            </Card>
          ))}
        </SimpleGrid>
        <Card withBorder padding="lg" radius="md">
        <Title order={1} size="h2">
              Ultimos filmes adicionados
            </Title>
        </Card>


      </Stack>
    </MantineContainer>
  );
};

export default DashboardPage;
