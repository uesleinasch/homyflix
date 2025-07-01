import React, { useState } from 'react';
import {
  Paper,
  TextInput,
  Button,
  Group,
  Stack,
  Title,
  Text,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { InfoIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useUser } from '../../hooks/useUser';

interface ChangePasswordCardProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

interface PasswordFormData {
  password: string;
  password_confirmation: string;
}
//TODO: teste mantine forms
const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ onCancel, onSuccess }) => {
  const { updatePassword, loading } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    initialValues: {
      password: '',
      password_confirmation: '',
    },
    validate: {
      password: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
        return null;
      },
      password_confirmation: (value, values) => {
        if (!value) return 'Confirmação de senha é obrigatória';
        if (value !== values.password) return 'Senhas não coincidem';
        return null;
      },
    },
  });

  const handleSubmit = async (values: PasswordFormData) => {
    const result = await updatePassword(values);
    
    if (result.success) {
      form.reset();
      onSuccess?.();
    }
  };

  return (
    <Paper shadow="sm" p="xl" radius="md" pos="relative">
      <LoadingOverlay visible={loading} />
      
      <Stack gap="lg">
        <Title order={3}>Alterar Senha</Title>

        <Alert icon={<InfoIcon size={16} />} color="blue" variant="light">
          <Text size="sm">
            Sua nova senha deve ter pelo menos 8 caracteres para garantir a segurança da sua conta.
          </Text>
        </Alert>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              type={showPassword ? 'text' : 'password'}
              required
              rightSection={
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setShowPassword(!showPassword)}
                  p={0}
                  style={{ background: 'transparent' }}
                >
                  {showPassword ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
                </Button>
              }
              {...form.getInputProps('password')}
            />

            <TextInput
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              rightSection={
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  p={0}
                  style={{ background: 'transparent' }}
                >
                  {showConfirmPassword ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
                </Button>
              }
              {...form.getInputProps('password_confirmation')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                color="red"
              >
                Alterar Senha
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

export default ChangePasswordCard; 