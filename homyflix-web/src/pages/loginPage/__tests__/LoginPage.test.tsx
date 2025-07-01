import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import LoginPage from '../LoginPage';
import authReducer from '../../../store/slices/authSlice';


jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('../../../core/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    authenticateUser: jest.fn(),
  }),
}));

jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
}));

jest.mock('../../../core/auth/api', () => ({
  api: {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>

        <MantineProvider>
          {component}
        </MantineProvider>

    </Provider>
  );
};

describe('LoginPage', () => {
  it('deve renderizar o input de email', () => {
    // Arrange & Act
    renderWithProviders(<LoginPage />);

    // Assert
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('placeholder', 'Insira seu email aqui');
  });

  it('deve renderizar o campo de senha', () => {
    // Arrange & Act
    renderWithProviders(<LoginPage />);

    // Assert
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('placeholder', 'Sua senha aqui');
  });

  it('deve renderizar o botão de submit', () => {
    // Arrange & Act
    renderWithProviders(<LoginPage />);

    // Assert
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar o botão para register', () => {
    renderWithProviders(<LoginPage />);

    // Assert
    const registerButton = screen.getByRole('link', { name: /cadastrar uma conta/i });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveAttribute('href', '/register');
  });
}); 