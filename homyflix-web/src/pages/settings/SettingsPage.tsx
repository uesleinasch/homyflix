import React, { useState } from "react";
import {
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Switch,
  Button,
  Divider,
  Collapse,
} from "@mantine/core";
import {
  ShieldIcon,
  PaletteIcon,
  SunIcon,
  MoonIcon,
} from "@phosphor-icons/react";
import { useTheme } from "../../shared/hooks/useTheme";
import MantineContainer from "../../shared/components/ui/mantineContainer/MantineContainer";
import ChangePasswordCard from "../../shared/components/forms/ChangePasswordCard";
import Header from "../../shared/components/ui/header/Header";

const SettingsPage: React.FC = () => {
  const { isDark, toggle } = useTheme();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
  };

  const handleChangePasswordCancel = () => {
    setShowChangePassword(false);
  };

  const handleChangePasswordSuccess = () => {
    setShowChangePassword(false);
  };

  return (
    <MantineContainer size="lg" >
      <Stack gap="lg">
        <Header title="Configurações" />
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
              <Button 
                variant="light" 
                color="red"
                onClick={handleChangePasswordClick}
                disabled={showChangePassword}
              >
                Alterar Senha
              </Button>
              <Button variant="light" color="orange">
                Excluir Conta
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Card de Mudança de Senha - Expansível */}
        <Collapse in={showChangePassword}>
          <ChangePasswordCard
            onCancel={handleChangePasswordCancel}
            onSuccess={handleChangePasswordSuccess}
          />
        </Collapse>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Title order={3}>Aparência</Title>

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
    </MantineContainer>
  );
};

export default SettingsPage;
