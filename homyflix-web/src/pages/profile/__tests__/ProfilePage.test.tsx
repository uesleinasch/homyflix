import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ProfilePage from "../ProfilePage";

// Mock do import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:8000/api',
        MODE: 'test',
        DEV: false,
        PROD: false
      }
    }
  },
  configurable: true
});

// Mock da API de autenticação
jest.mock("../../../core/auth/api", () => ({
  default: {
    defaults: { baseURL: 'http://localhost:8000/api' },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn()
  }
}));

// Mock do tokenManager
jest.mock("../../../core/auth/tokenManager", () => ({
  tokenManager: {
    getToken: jest.fn(() => "mock-token"),
    getCurrentUser: jest.fn(() => ({
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      created_at: '2024-01-15T10:30:00Z'
    })),
    isTokenValid: jest.fn(() => true),
    clearToken: jest.fn(),
    setToken: jest.fn(),
    setUser: jest.fn()
  }
}));

// Mock dos serviços de autenticação
jest.mock("../../../shared/services/authApplicationService", () => ({
  authApplicationService: {
    authenticateUser: jest.fn(),
    registerUser: jest.fn(),
    logoutUser: jest.fn(),
    refreshUserToken: jest.fn()
  }
}));

// Mock do React Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock dos ícones do Phosphor
jest.mock("@phosphor-icons/react", () => ({
  PencilIcon: ({ size }: { size?: number }) => (
    <span data-testid="pencil-icon" style={{ fontSize: size }}>✏️</span>
  ),
}));

// Mock do hook useAuth
const mockUseAuth: any = {
  user: {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    created_at: '2024-01-15T10:30:00Z'
  },
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
  authenticateUser: jest.fn(() => Promise.resolve({ success: true })),
  registerUser: jest.fn(() => Promise.resolve({ success: true })),
  logoutUser: jest.fn(() => Promise.resolve({ success: true })),
  refreshUserToken: jest.fn(() => Promise.resolve({ success: true })),
  syncAuth: jest.fn(),
  clearAuth: jest.fn(),
  isTokenValid: jest.fn(() => true),
  logout: jest.fn(() => Promise.resolve({ success: true })),
  refreshToken: jest.fn(() => Promise.resolve({ success: true }))
};

jest.mock("../../../core/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

// Mock dos slices do Redux
jest.mock("../../../store/slices/authSlice", () => {
  const originalModule = jest.requireActual("../../../store/slices/authSlice");
  return {
    ...originalModule,
    login: {
      ...originalModule.login,
      pending: { type: 'auth/login/pending' },
      fulfilled: { type: 'auth/login/fulfilled' },
      rejected: { type: 'auth/login/rejected' }
    },
    register: {
      ...originalModule.register,
      pending: { type: 'auth/register/pending' },
      fulfilled: { type: 'auth/register/fulfilled' },
      rejected: { type: 'auth/register/rejected' }
    },
    logout: {
      ...originalModule.logout,
      pending: { type: 'auth/logout/pending' },
      fulfilled: { type: 'auth/logout/fulfilled' },
      rejected: { type: 'auth/logout/rejected' }
    },
    refreshToken: {
      ...originalModule.refreshToken,
      pending: { type: 'auth/refreshToken/pending' },
      fulfilled: { type: 'auth/refreshToken/fulfilled' },
      rejected: { type: 'auth/refreshToken/rejected' }
    }
  };
});

// Criação dos reducers mock
const createMockAuthReducer = (
  initialState = { 
    user: null, 
    token: null, 
    isAuthenticated: false, 
    isLoading: false, 
    error: null 
  }
) => {
  return (state = initialState) => state;
};

describe("ProfilePage", () => {
  const renderWithProviders = (authState?: any) => {
    const store = configureStore({
      reducer: {
        auth: createMockAuthReducer(authState),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          thunk: false 
        }),
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MantineProvider>
            <ProfilePage />
          </MantineProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock do useAuth para estado padrão
    Object.assign(mockUseAuth, {
      user: {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        created_at: '2024-01-15T10:30:00Z'
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      authenticateUser: jest.fn(() => Promise.resolve({ success: true })),
      registerUser: jest.fn(() => Promise.resolve({ success: true })),
      logoutUser: jest.fn(() => Promise.resolve({ success: true })),
      refreshUserToken: jest.fn(() => Promise.resolve({ success: true })),
      syncAuth: jest.fn(),
      clearAuth: jest.fn(),
      isTokenValid: jest.fn(() => true),
      logout: jest.fn(() => Promise.resolve({ success: true })),
      refreshToken: jest.fn(() => Promise.resolve({ success: true }))
    });
  });

  it("should render the component successfully", () => {
    renderWithProviders();
    
    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
    expect(screen.getByText("Informações da Conta")).toBeInTheDocument();
  });

  it("should render user profile information correctly when user is authenticated", () => {
    // Arrange
    const authState = {
      user: {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        created_at: '2024-01-15T10:30:00Z'
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null
    };

    // Act
    renderWithProviders(authState);

    // Assert - Elementos principais da página
    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
    expect(screen.getByText("Informações da Conta")).toBeInTheDocument();
    expect(screen.getByText("Membro desde:")).toBeInTheDocument();
    
    // Assert - Informações do usuário aparecem múltiplas vezes
    expect(screen.getAllByText("João Silva")).toHaveLength(2);
    expect(screen.getAllByText("joao@example.com")).toHaveLength(2);
    
    // Assert - Data formatada corretamente
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
    
    // Assert - Avatar com inicial do nome
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should handle case when user is not authenticated", () => {
    // Arrange
    mockUseAuth.user = null;
    mockUseAuth.isAuthenticated = false;
    
    const authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };

    // Act & Assert
    expect(() => {
      renderWithProviders(authState);
    }).not.toThrow();

    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("should handle case when user data is incomplete", () => {
    // Arrange
    const incompleteUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      created_at: null
    };
    
    mockUseAuth.user = incompleteUser;
    
    const authState = {
      user: incompleteUser,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null
    };

    // Act
    renderWithProviders(authState);

    // Assert 
    const emailElements = screen.getAllByText("joao@example.com");
    expect(emailElements).toHaveLength(2);
    expect(emailElements[0]).toBeInTheDocument();
    
    // Assert 
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("should display edit profile button with correct icon", () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    expect(editButton).toBeInTheDocument();
    
    const pencilIcon = screen.getByTestId("pencil-icon");
    expect(pencilIcon).toBeInTheDocument();
  });

  it("should handle edit profile button click", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Editar perfil');
    
    consoleSpy.mockRestore();
  });

  it("should display user avatar with correct initial", () => {
    renderWithProviders();
    
    const avatar = screen.getByText("J"); 
    expect(avatar).toBeInTheDocument();
  });

  it("should format date correctly in Brazilian format", () => {
    renderWithProviders();
    

    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
  });

  it("should display all profile sections", () => {
    renderWithProviders();
    

    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("Informações da Conta")).toBeInTheDocument();
    
    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Membro desde:")).toBeInTheDocument();
  });

  it("should handle user with different name initial", () => {
    // Arrange
    const userWithDifferentName = {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      created_at: '2024-02-20T15:45:00Z'
    };
    
    mockUseAuth.user = userWithDifferentName;
    
    const authState = {
      user: userWithDifferentName,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null
    };

    // Act
    renderWithProviders(authState);

    // Assert
    expect(screen.getByText("M")).toBeInTheDocument(); // Inicial de "Maria"
    expect(screen.getAllByText("Maria Santos")).toHaveLength(2);
    expect(screen.getAllByText("maria@example.com")).toHaveLength(2);
    expect(screen.getByText("20/02/2024")).toBeInTheDocument();
  });
}); 