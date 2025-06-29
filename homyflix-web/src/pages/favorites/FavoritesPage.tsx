import React from 'react';
import { Container, Title, Text, Center, Stack } from '@mantine/core';
import { HeartIcon } from '@phosphor-icons/react';

const FavoritesPage: React.FC = () => {
  return (
    <Container size="lg" py="xl">
      <Center>
        <Stack align="center" gap="md">
          <HeartIcon size={64} weight="duotone" color="var(--mantine-color-orange-6)" />
          <Title order={2}>Favoritos</Title>
          <Text c="dimmed">Em breve você poderá ver seus filmes favoritos aqui!</Text>
        </Stack>
      </Center>
    </Container>
  );
};

export default FavoritesPage; 