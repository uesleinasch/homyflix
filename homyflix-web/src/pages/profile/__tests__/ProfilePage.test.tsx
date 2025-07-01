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

// Mock das notificações do Mantine
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

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
    setCurrentUser: jest.fn(),
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

// Mock do userService
jest.mock("../../../shared/services/userService", () => ({
  userService: {
    updatePassword: jest.fn(),
    updateProfile: jest.fn(() => Promise.resolve({
      id: 1,
      name: 'João Silva Atualizado',
      email: 'joao.atualizado@example.com',
      created_at: '2024-01-15T10:30:00Z'
    })),
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
  CheckIcon: ({ size }: { size?: number }) => (
    <span data-testid="check-icon" style={{ fontSize: size }}>✓</span>
  ),
  XIcon: ({ size }: { size?: number }) => (
    <span data-testid="x-icon" style={{ fontSize: size }}>✕</span>
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

const mockUseUser: any = {
  user: {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    created_at: '2024-01-15T10:30:00Z'
  },
  loading: false,
  error: null,
  updatePassword: jest.fn(() => Promise.resolve({ success: true })),
  updateProfile: jest.fn(() => Promise.resolve({ success: true })),
};

jest.mock("../../../shared/hooks/useUser", () => ({
  useUser: () => mockUseUser,
}));

jest.mock("../../../store/slices/authSlice", () => {
  const originalModule = jest.requireActual("../../../store/slices/authSlice");
  return {
    ...originalModule,
    syncAuthState: jest.fn(() => ({ type: 'auth/syncAuthState' })),
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

const createMockAuthReducer = (
  initialState = { 
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
  }
) => {
  return (state = initialState) => state;
};

describe("ProfilePage", () => {
  const renderWithProviders = (authState?: any) => {
    const defaultAuthState = {
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

    const store = configureStore({
      reducer: {
        auth: createMockAuthReducer(authState || defaultAuthState),
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


    Object.assign(mockUseUser, {
      user: {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        created_at: '2024-01-15T10:30:00Z'
      },
      loading: false,
      error: null,
      updatePassword: jest.fn(() => Promise.resolve({ success: true })),
      updateProfile: jest.fn(() => Promise.resolve({ success: true })),
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
    expect(screen.getAllByText("João Silva")).toHaveLength(2);
    expect(screen.getAllByText("joao@example.com")).toHaveLength(2);
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
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

  it("should enter edit mode when edit button is clicked", () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    

    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
  });

  it("should populate form fields with current user data when entering edit mode", () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    
    expect(emailInput.value).toBe('joao@example.com');
    expect(nameInput.value).toBe('João Silva');
  });

  it("should cancel edit mode when cancel button is clicked", () => {
    renderWithProviders();

    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(screen.getByRole("button", { name: /editar perfil/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /salvar/i })).not.toBeInTheDocument();
  });

  it("should validate required fields before saving", async () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/nome/i);
    
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(nameInput, { target: { value: '' } });
    
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    });
  });

  it("should validate email format", async () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
  
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText("Email deve ter um formato válido")).toBeInTheDocument();
    });
  });

  it("should call updateProfile when form is valid and save button is clicked", async () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText(/email/i);
    const nameInput = screen.getByLabelText(/nome/i);
    
    fireEvent.change(emailInput, { target: { value: 'novo@email.com' } });
    fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
    
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUseUser.updateProfile).toHaveBeenCalledWith({
        name: 'Novo Nome',
        email: 'novo@email.com'
      });
    });
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
    expect(screen.getByText("M")).toBeInTheDocument(); 
    expect(screen.getAllByText("Maria Santos")).toHaveLength(2);
    expect(screen.getAllByText("maria@example.com")).toHaveLength(2);
    expect(screen.getByText("20/02/2024")).toBeInTheDocument();
  });

  it("should display loading overlay when loading is true", () => {
    // Arrange
    mockUseUser.loading = true;
    
    // Act
    renderWithProviders();
    
    // Assert
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    expect(editButton).toBeDisabled();
  });

  it("should display error message when there is an error", () => {
    // Arrange
    mockUseUser.error = 'Erro ao atualizar perfil';
    
    // Act
    renderWithProviders();
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    // Assert
    expect(screen.getByText("Erro ao atualizar perfil")).toBeInTheDocument();
  });

  it("should clear field errors when user starts typing", async () => {
    renderWithProviders();
    
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);
    
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    const saveButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    });
    
    fireEvent.change(nameInput, { target: { value: 'N' } });
    await waitFor(() => {
      expect(screen.queryByText("Nome é obrigatório")).not.toBeInTheDocument();
    });
  });
}); 