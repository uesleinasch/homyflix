import React from 'react';
import { Container, Paper, Title, Stack, Group, Avatar, Text, Button } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import {  PencilIcon } from '@phosphor-icons/react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container size="md">
      <Stack gap="lg">
        <Title order={1}>Meu Perfil</Title>
        
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Group>
              <Avatar size="xl" radius="xl" name={user?.name} color="blue">
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text size="xl" fw={600}>
                  {user?.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
              </div>
            </Group>

            <Group>
              <Button 
                leftSection={<PencilIcon size={16} />}
                variant="light"
                onClick={() => {
                  // TODO: Implementar edição de perfil
                  console.log('Editar perfil');
                }}
              >
                Editar Perfil
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="md">
            <Title order={3}>Informações da Conta</Title>
            
            <Group justify="space-between">
              <Text fw={500}>Nome:</Text>
              <Text>{user?.name}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>Email:</Text>
              <Text>{user?.email}</Text>
            </Group>
            
            <Group justify="space-between">
              <Text fw={500}>Membro desde:</Text>
              <Text>{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}</Text>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProfilePage; 