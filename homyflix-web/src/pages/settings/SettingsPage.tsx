import React from 'react';
import { Container, Paper, Title, Stack, Group, Text, Switch, Button, Divider } from '@mantine/core';
import { BellIcon, ShieldIcon, PaletteIcon, GlobeIcon } from '@phosphor-icons/react';

const SettingsPage: React.FC = () => {

  return (
    <Container size="md">
      <Stack gap="lg">
        <Title order={1}>Configurações</Title>
        
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Title order={3}>Notificações</Title>
            
            <Group justify="space-between">
              <Group>
                <BellIcon size={20} />
                <div>
                  <Text fw={500}>Notificações por Email</Text>
                  <Text size="sm" c="dimmed">
                    Receba atualizações sobre seus filmes por email
                  </Text>
                </div>
              </Group>
              <Switch defaultChecked />
            </Group>

            <Group justify="space-between">
              <Group>
                <BellIcon size={20} />
                <div>
                  <Text fw={500}>Notificações Push</Text>
                  <Text size="sm" c="dimmed">
                    Receba notificações no navegador
                  </Text>
                </div>
              </Group>
              <Switch />
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Title order={3}>Privacidade e Segurança</Title>
            
            <Group justify="space-between">
              <Group>
                <ShieldIcon size={20} />
                <div>
                  <Text fw={500}>Perfil Público</Text>
                  <Text size="sm" c="dimmed">
                    Permitir que outros usuários vejam seu perfil
                  </Text>
                </div>
              </Group>
              <Switch />
            </Group>

            <Divider />

            <Group>
              <Button variant="light" color="red">
                Alterar Senha
              </Button>
              <Button variant="light" color="orange">
                Excluir Conta
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Title order={3}>Aparência</Title>
            
            <Group justify="space-between">
              <Group>
                <PaletteIcon size={20} />
                <div>
                  <Text fw={500}>Tema Escuro</Text>
                  <Text size="sm" c="dimmed">
                    Usar tema escuro na aplicação
                  </Text>
                </div>
              </Group>
              <Switch />
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Title order={3}>Idioma e Região</Title>
            
            <Group justify="space-between">
              <Group>
                <GlobeIcon size={20} />
                <div>
                  <Text fw={500}>Idioma</Text>
                  <Text size="sm" c="dimmed">
                    Português (Brasil)
                  </Text>
                </div>
              </Group>
              <Button variant="light" size="sm">
                Alterar
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage; 