import * as React from 'react';
import { useState, useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Title, 
  Stack, 
  Group, 
  Avatar, 
  Text, 
  Button, 
  TextInput,
  LoadingOverlay,
  Alert
} from '@mantine/core';
import { useAuth } from '../../core/hooks/useAuth';
import { useUser } from '../../shared/hooks/useUser';
import { PencilIcon, CheckIcon, XIcon } from '@phosphor-icons/react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { updateProfile, loading, error } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const handleStartEditing = useCallback(() => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setFormErrors({});
    setIsEditing(true);
  }, [user]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditForm({ name: '', email: '' });
    setFormErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const errors: typeof formErrors = {};
    
    if (!editForm.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (editForm.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Email deve ter um formato válido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editForm]);

  const handleSaveChanges = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const result = await updateProfile({
      name: editForm.name.trim(),
      email: editForm.email.trim()
    });

    if (result.success) {
      setIsEditing(false);
      setEditForm({ name: '', email: '' });
      setFormErrors({});
    }
  }, [editForm, validateForm, updateProfile]);

  const handleInputChange = useCallback((field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  return (
    <Container size="md">
      <Stack gap="lg">
        <Title order={1}>Meu Perfil</Title>
        
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <Group>
              <Avatar size="xl" radius="xl" name={user?.name} color="orange">
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
              {!isEditing ? (
                <Button 
                  leftSection={<PencilIcon size={16} />}
                  variant="light"
                  onClick={handleStartEditing}
                  disabled={loading}
                >
                  Editar Perfil
                </Button>
              ) : (
                <Group>
                  <Button 
                    leftSection={<CheckIcon size={16} />}
                    color="green"
                    onClick={handleSaveChanges}
                    loading={loading}
                  >
                    Salvar
                  </Button>
                  <Button 
                    leftSection={<XIcon size={16} />}
                    variant="outline"
                    color="red"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Group>
              )}
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" pos="relative">
          <LoadingOverlay visible={loading} />
          
          <Stack gap="md">
            <Title order={3}>Informações da Conta</Title>
            
            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}
            
            {!isEditing ? (
              <>
                <Group justify="space-between">
                  <Text fw={500}>Email:</Text>
                  <Text>{user?.email}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text fw={500}>Nome:</Text>
                  <Text>{user?.name}</Text>
                </Group>
              </>
            ) : (
              <>
                <TextInput
                  label="Email"
                  placeholder="Digite seu email"
                  value={editForm.email}
                  onChange={(event) => handleInputChange('email', event.currentTarget.value)}
                  error={formErrors.email}
                  required
                />
                
                <TextInput
                  label="Nome"
                  placeholder="Digite seu nome"
                  value={editForm.name}
                  onChange={(event) => handleInputChange('name', event.currentTarget.value)}
                  error={formErrors.name}
                  required
                />
              </>
            )}
            
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