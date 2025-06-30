import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import CreateMovie from "../CreateMovie";
import movieReducer from "../../../../store/slices/movieSlice";
import authReducer from "../../../../store/slices/authSlice";

// Mock do import.meta.env (específico para este teste)
if (!(globalThis as any).import?.meta) {
  Object.defineProperty(globalThis, 'import', {
    value: {
      meta: {
        env: {
          VITE_API_URL: 'http://localhost:8000/api',
          MODE: 'test',
          DEV: true,
          PROD: false
        }
      }
    },
    configurable: true
  });
}

// Mock da API axios
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
    delete: jest.fn()
  }
}));

// Mock do tokenManager
jest.mock("../../../../core/auth/tokenManager", () => ({
  tokenManager: {
    getToken: jest.fn(() => 'fake-token'),
    getCurrentUser: jest.fn(() => null),
    isTokenValid: jest.fn(() => true),
    clearToken: jest.fn()
  }
}));

// Mock dos serviços
jest.mock("../../../../core/services/movieService", () => ({
  movieService: {
    getAllMovies: jest.fn(),
    getMovieById: jest.fn(),
    createMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn()
  }
}));

jest.mock("../../../../shared/services/authApplicationService", () => ({
  authApplicationService: {
    authenticateUser: jest.fn(),
    registerUser: jest.fn(),
    logoutUser: jest.fn(),
    refreshUserToken: jest.fn()
  }
}));

// Mock do react-router-dom
const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

// Mock do hook customizado - MAIS IMPORTANTE PARA EVITAR O LOOP
const mockCreateNewMovie = jest.fn();
const mockUpdateExistingMovie = jest.fn();
const mockLoadMovieById = jest.fn();

jest.mock("../../../../core/hooks/useMovieOperations", () => ({
  useMovieOperations: jest.fn(() => ({
    createNewMovie: mockCreateNewMovie,
    updateExistingMovie: mockUpdateExistingMovie,
    loadMovieById: mockLoadMovieById,
    loading: false,
    movies: [],
    error: null,
    clearMovieError: jest.fn(),
  })),
}));

// Mock dos componentes que podem causar problemas
jest.mock("../../../../shared/components/ui/header/Header", () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

jest.mock("../../../../shared/components/ui/loaderScreen/LoadScreen", () => {
  return function MockLoadScreen({ isLoading, loadingText }: { isLoading: boolean; loadingText: string }) {
    return isLoading ? <div data-testid="mock-load-screen">{loadingText}</div> : null;
  };
});

jest.mock("../../../../shared/components/ui/mantineContainer/MantineContainer", () => {
  return function MockMantineContainer({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-mantine-container">{children}</div>;
  };
});

describe("CreateMovie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({});
  });

  const renderWithProviders = (initialState = {}, routerProps = {}) => {
    const store = configureStore({
      reducer: {
        movies: movieReducer,
        auth: authReducer,
      },
      preloadedState: {
        movies: {
          movies: [],
          isLoading: false,
          error: null,
        },
        auth: {
          user: null,
          token: "fake-token",
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
        ...initialState,
      },
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/movies/create"]} {...routerProps}>
          <MantineProvider>
            <CreateMovie />
          </MantineProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it("should render create movie form without crashing", () => {
    const { container } = renderWithProviders();
    
    expect(container).toBeDefined();
    
    expect(screen.getByTestId("mock-mantine-container")).toBeInTheDocument();
  });

  it("should render in create mode when no id param is provided", () => {
    renderWithProviders();
    
    expect(mockLoadMovieById).not.toHaveBeenCalled();
  });

  it("should render in edit mode when id param is provided", () => {
    mockUseParams.mockReturnValue({ id: "123" });
    
    renderWithProviders();
    
    expect(mockLoadMovieById).toHaveBeenCalledWith(123);
  });

  it("should handle invalid id param gracefully", () => {
    mockUseParams.mockReturnValue({ id: "invalid" });
    
    const { container } = renderWithProviders();
    
    expect(container).toBeDefined();
    
    expect(mockLoadMovieById).not.toHaveBeenCalled();
  });

 
});
