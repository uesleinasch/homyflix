import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { EyeIcon, EyeSlashIcon, XIcon } from "@phosphor-icons/react";
import {
  LoginSchema,
  type LoginFormData,
} from "../../core/auth/schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import styles from "./style.module.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authenticateUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await authenticateUser(data);

    if (!result.success) {
      notifications.show({
        title: "Erro no Login",
        message: result.error || "Ocorreu um erro ao fazer login.",
        color: "red",
        icon: <XIcon size={16} />,
        autoClose: 5000,
      });

      setError("root", {
        type: "manual",
        message: result.error || "Ocorreu um erro ao fazer login.",
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
          className={styles.loginPaper}
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
                  label="E-mail"
                  placeholder="Insira seu email aqui"
                  size="md"
                  {...register("email")}
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
                  {...register("password")}
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

                <Stack gap="sm" mt="md">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    size="md"
                    fullWidth
                    className={styles.loginButton}
                  >
                    Entrar
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    component={Link}
                    to="/register"
                    className={styles.registerButton}
                  >
                    Criar uma conta
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Paper>

        <Box style={{ flex: 1 }} className={styles.loginCoverImage}>
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

export default LoginPage;
