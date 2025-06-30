import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

// Mock do hook useAuth
const mockAuthenticateUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../../core/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    authenticateUser: mockAuthenticateUser
  })
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>
}));

// Mock das notificações
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </MantineProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    // Arrange & Act
    renderWithProviders(<LoginPage />);

    // Assert
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cadastrar uma conta' })).toBeInTheDocument();
    expect(screen.getByAltText('HoMyFlix Logo')).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    // Arrange
    renderWithProviders(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: 'Entrar' });

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('should call authenticateUser when form is submitted with valid data', async () => {
    // Arrange
    mockAuthenticateUser.mockResolvedValue({ success: true });
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });

    // Act
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockAuthenticateUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
}); 