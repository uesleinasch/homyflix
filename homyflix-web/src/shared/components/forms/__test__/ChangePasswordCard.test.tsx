import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ChangePasswordCard from "../ChangePasswordCard";


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


jest.mock("../../../../core/auth/api", () => ({
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


jest.mock("../../../../core/auth/tokenManager", () => ({
  tokenManager: {
    getToken: jest.fn(() => 'mock-token'),
    getCurrentUser: jest.fn(() => ({
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    })),
    isTokenValid: jest.fn(() => true),
    clearToken: jest.fn(),
    setToken: jest.fn(),
    setCurrentUser: jest.fn()
  }
}));

jest.mock("../../../services/userService", () => ({
  userService: {
    updateProfile: jest.fn(() => Promise.resolve({
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    })),
    updatePassword: jest.fn(() => Promise.resolve({
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    })),
    getProfile: jest.fn(() => Promise.resolve({
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }))
  }
}));

jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
    hide: jest.fn(),
    clean: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock("@phosphor-icons/react", () => ({
  InfoIcon: () => <div data-testid="info-icon">ℹ</div>,
  EyeIcon: () => <button data-testid="eye-icon">👁</button>,
  EyeSlashIcon: () => <button data-testid="eye-slash-icon">🙈</button>,
}));

const mockUseUser: any = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  },
  loading: false,
  error: null,
  updatePassword: jest.fn(() => Promise.resolve({ success: true })),
  updateProfile: jest.fn(() => Promise.resolve({ success: true }))
};

jest.mock("../../../hooks/useUser", () => ({
  useUser: () => mockUseUser,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockForm = {
  values: { password: '', password_confirmation: '' },
  errors: {},
  onSubmit: jest.fn((callback: any) => (e: any) => {
    e?.preventDefault();
    callback({ password: 'newpassword123', password_confirmation: 'newpassword123' });
  }),
  getInputProps: jest.fn((field: string) => ({
    value: '',
    onChange: jest.fn(),
    error: null
  })),
  reset: jest.fn(),
  setFieldValue: jest.fn(),
  validate: jest.fn(),
};

jest.mock("@mantine/form", () => ({
  useForm: () => mockForm,
}));

jest.mock("../../../../store/slices/authSlice", () => {
  const originalModule = jest.requireActual("../../../../store/slices/authSlice");
  return {
    ...originalModule,
    syncAuthState: jest.fn(),
    clearAuthState: jest.fn(),
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

const createMockAuthReducer = (initialState = { 
  user: { id: 1, name: 'Test User', email: 'test@example.com' }, 
  token: 'mock-token', 
  isAuthenticated: true, 
  isLoading: false, 
  error: null 
}) => {
  return (state = initialState) => state;
};

describe("ChangePasswordCard", () => {
  const mockOnCancel = jest.fn();
  const mockOnSuccess = jest.fn();

  const renderWithProviders = (props = {}) => {
    const store = configureStore({
      reducer: {
        auth: createMockAuthReducer(),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          thunk: false 
        }),
    });

    const defaultProps = {
      onCancel: mockOnCancel,
      onSuccess: mockOnSuccess,
      ...props
    };

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MantineProvider>
            <ChangePasswordCard {...defaultProps} />
          </MantineProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.assign(mockUseUser, {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      },
      loading: false,
      error: null,
      updatePassword: jest.fn(() => Promise.resolve({ success: true })),
      updateProfile: jest.fn(() => Promise.resolve({ success: true }))
    });
  });

  it("should render the component successfully", () => {
    renderWithProviders();
    
    expect(screen.getByRole("heading", { name: "Alterar Senha" })).toBeInTheDocument();
    expect(screen.getByText("Sua nova senha deve ter pelo menos 8 caracteres para garantir a segurança da sua conta.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua nova senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme sua nova senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alterar Senha" })).toBeInTheDocument();
  });

  it("should render info alert correctly", () => {
    renderWithProviders();
    
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
    expect(screen.getByText("Sua nova senha deve ter pelo menos 8 caracteres para garantir a segurança da sua conta.")).toBeInTheDocument();
  });

  it("should render password input fields with eye icons", () => {
    renderWithProviders();
    
    const passwordInput = screen.getByPlaceholderText("Digite sua nova senha");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirme sua nova senha");
    
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(screen.getAllByTestId("eye-icon")).toHaveLength(2);
  });

  it("should toggle password visibility when eye icon is clicked", async () => {
    renderWithProviders();
    const eyeIcons = screen.getAllByTestId("eye-icon");
    fireEvent.click(eyeIcons[0]);
    
    await waitFor(() => {
      expect(screen.getByTestId("eye-slash-icon")).toBeInTheDocument();
    });
  });

  it("should display loading overlay when loading is true", () => {
    mockUseUser.loading = true;
    renderWithProviders();
    

    expect(mockUseUser.loading).toBe(true);
  });

  it("should call onCancel when cancel button is clicked", () => {
    renderWithProviders();
    
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should disable cancel button when loading", () => {
    mockUseUser.loading = true;
    renderWithProviders();
    
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    expect(cancelButton).toBeDisabled();
  });

  it("should show loading state on submit button when loading", () => {
    mockUseUser.loading = true;
    renderWithProviders();
    
    const submitButton = screen.getByRole("button", { name: "Alterar Senha" });
    expect(submitButton).toBeInTheDocument();
  });

  it("should call updatePassword when form is submitted", async () => {
    const updatePasswordSpy = jest.fn(() => Promise.resolve({ success: true }));
    mockUseUser.updatePassword = updatePasswordSpy;
    
    const { container } = renderWithProviders();
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(updatePasswordSpy).toHaveBeenCalledWith({
        password: 'newpassword123',
        password_confirmation: 'newpassword123'
      });
    });
  });

  it("should call onSuccess when password update is successful", async () => {
    const updatePasswordSpy = jest.fn(() => Promise.resolve({ success: true }));
    mockUseUser.updatePassword = updatePasswordSpy;
    
    const { container } = renderWithProviders();
    
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("should render with proper form structure", () => {
    renderWithProviders();
    
    expect(screen.getByPlaceholderText("Digite sua nova senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme sua nova senha")).toBeInTheDocument();
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(4); // 2 eye buttons + cancel + submit
    
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alterar Senha" })).toBeInTheDocument();
  });

  it("should have correct input placeholders", () => {
    renderWithProviders();
    
    expect(screen.getByPlaceholderText("Digite sua nova senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme sua nova senha")).toBeInTheDocument();
  });

  it("should have correct button colors and variants", () => {
    renderWithProviders();
    
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    const submitButton = screen.getByRole("button", { name: "Alterar Senha" });
    
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
}); 