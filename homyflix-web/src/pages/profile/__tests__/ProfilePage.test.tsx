import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import ProfilePage from '../ProfilePage';

// Mock do hook useAuth - será sobrescrito em cada teste
const mockUseAuth = jest.fn();

jest.mock('../../../core/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user profile information correctly when user is authenticated', () => {
    // Arrange
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        created_at: '2024-01-15T10:30:00Z'
      }
    });

    // Act
    renderWithProviders(<ProfilePage />);

    // Assert
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Informações da Conta')).toBeInTheDocument();
    expect(screen.getByText('Membro desde:')).toBeInTheDocument();
    
    // Assert 
    expect(screen.getAllByText('João Silva')).toHaveLength(2);
    expect(screen.getAllByText('joao@example.com')).toHaveLength(2);
    
    // Assert
    expect(screen.getAllByText('João Silva')[0]).toBeInTheDocument();
    expect(screen.getAllByText('joao@example.com')[0]).toBeInTheDocument();
  });

  it('should handle case when user is not authenticated', () => {
    // Arrange
    mockUseAuth.mockReturnValue({
      user: null
    });

    // Act & Assert
    expect(() => {
      renderWithProviders(<ProfilePage />);
    }).not.toThrow();

    expect(screen.queryByText('Meu Perfil')).toBeInTheDocument();
  });
}); 