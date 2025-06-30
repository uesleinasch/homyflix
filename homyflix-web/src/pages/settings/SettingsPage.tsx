import React from 'react';
import { Container, Paper, Title, Stack, Group, Text, Switch, Button, Divider, Select } from '@mantine/core';
import { BellIcon, ShieldIcon, PaletteIcon, GlobeIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';
import { useTheme } from '../../shared/hooks/useTheme';
import type { ColorScheme } from '../../store/slices/themeSlice';

const SettingsPage: React.FC = () => {
  const { 
    colorScheme, 
    changeColorScheme, 
    getColorSchemeOptions, 
    isDark,
    toggle 
  } = useTheme();

  const handleThemeChange = (value: string | null) => {
    if (value && ['light', 'dark', 'auto'].includes(value)) {
      changeColorScheme(value as ColorScheme);
    }
  };

  return (
    <Container size="md">
      <Stack gap="lg">
        <Title order={1}>Configurações</Title>

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
                  <Text fw={500}>Tema da Aplicação</Text>
                  <Text size="sm" c="dimmed">
                    Escolha entre tema claro, escuro ou automático (sistema)
                  </Text>
                </div>
              </Group>
              <Select
                value={colorScheme}
                onChange={handleThemeChange}
                data={getColorSchemeOptions()}
                w={120}
                comboboxProps={{ 
                  transitionProps: { transition: 'pop', duration: 200 } 
                }}
              />
            </Group>

            <Divider />

            <Group justify="space-between">
              <Group>
                <PaletteIcon size={20} />
                <div>
                  <Text fw={500}>Alternar Tema Rápido</Text>
                  <Text size="sm" c="dimmed">
                    Alternar entre claro e escuro rapidamente
                  </Text>
                </div>
              </Group>
              <Switch 
                checked={isDark}
                onChange={toggle}
                size="md"
                onLabel={<SunIcon size={16} />}
                offLabel={<MoonIcon size={16} />}
              />
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingsPage; 