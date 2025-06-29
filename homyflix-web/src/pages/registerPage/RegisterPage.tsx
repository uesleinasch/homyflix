import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Image,
  Stack,
  BackgroundImage,
  Flex,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { EyeIcon, EyeSlashIcon, XIcon } from '@phosphor-icons/react';
import { RegisterSchema, type RegisterFormData } from '../../core/auth/schemas/authSchemas';
import { useAuth } from '../../core/hooks/useAuth';
import styles from './style.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data);
    
    if (!result.success) {
      notifications.show({
        title: 'Erro no Registro',
        message: result.error || 'Ocorreu um erro ao registrar.',
        color: 'red',
        icon: <XIcon size={16} />,
        autoClose: 5000,
      });

      setError('root', {
        type: 'manual',
        message: result.error || 'Ocorreu um erro ao registrar.',
      });
    }
  };

  return (
    <Container fluid p={0} mih="100vh" miw={"100vw"}>
      <Flex justify="space-between" align="center" w={"100%"} h="100vh">
        <Paper 
          shadow="none" 
          p={{ base: "sm", md: "xl" }} 
          radius="md"  
          className={styles.registerPaper}
        >
          <Stack gap="lg" pl={{ base: 20, md: 100 }} pr={{ base: 20, md: 100 }}>
            <Image
              src="/HoMyFlixLogo.png"
              alt="HoMyFlix Logo"
              h={120}
              w="auto"
              mx="auto"
              mb="md"
              className={styles.LogoEffect}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Nome"
                  placeholder="Insira seu nome aqui"
                  size="md"
                  {...register('name')}
                  error={errors.name?.message}
                  styles={{
                    input: {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      "&:focus": {
                        borderColor: "#e67e22",
                      },
                    },
                  }}
                />

                <TextInput
                  label="E-mail"
                  placeholder="Insira seu email aqui"
                  size="md"
                  {...register('email')}
                  error={errors.email?.message}
                  styles={{
                    input: {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      "&:focus": {
                        borderColor: "#e67e22",
                      },
                    },
                  }}
                />

                <PasswordInput
                  label="Senha"
                  placeholder="Sua senha aqui"
                  size="md"
                  {...register('password')}
                  error={errors.password?.message}
                  visibilityToggleIcon={({ reveal }) =>
                    reveal ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />
                  }
                  styles={{
                    input: {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      "&:focus": {
                        borderColor: "#e67e22",
                      },
                    },
                  }}
                />

                <PasswordInput
                  label="Confirmar Senha"
                  placeholder="Confirme sua senha aqui"
                  size="md"
                  {...register('password_confirmation')}
                  error={errors.password_confirmation?.message}
                  visibilityToggleIcon={({ reveal }) =>
                    reveal ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />
                  }
                  styles={{
                    input: {
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      "&:focus": {
                        borderColor: "#e67e22",
                      },
                    },
                  }}
                />

                <Stack gap="sm" mt="md">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    size="md"
                    fullWidth
                    className={styles.registerButton}
                  >
                    Criar Conta
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    component={Link}
                    to="/login"
                    className={styles.loginButton}
                  >
                    Já tenho uma conta
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Paper>

        <Box style={{ flex: 1 }} className={styles.registerCoverImage}>
          <BackgroundImage
            src="/loginCover.jpg"
            h="100vh"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Box>
      </Flex>
    </Container>
  );
};

export default RegisterPage;
