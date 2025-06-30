import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import MovieDetail from "../MovieDetail";

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
    getToken: jest.fn(() => 'fake-token'),
    getCurrentUser: jest.fn(() => null),
    isTokenValid: jest.fn(() => true),
    clearToken: jest.fn(),
    setToken: jest.fn(),
    setUser: jest.fn()
  }
}));

jest.mock("../../../../core/services/movieService", () => ({
  movieService: {
    getAllMovies: jest.fn(() => Promise.resolve([])),
    getMovieById: jest.fn(() => Promise.resolve({})),
    createMovie: jest.fn(() => Promise.resolve({})),
    updateMovie: jest.fn(() => Promise.resolve({})),
    deleteMovie: jest.fn(() => Promise.resolve())
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

jest.mock("@phosphor-icons/react", () => ({
  ArrowLeftIcon: () => <button data-testid="arrow-left-icon">←</button>,
  PenIcon: () => <button data-testid="pen-icon">✏</button>,
  TrashIcon: () => <button data-testid="trash-icon">🗑</button>,
}));

const mockLoadMovieById = jest.fn();
const mockDeleteExistingMovie = jest.fn();

const mockUseMovieOperations = {
  loadMovieById: mockLoadMovieById,
  deleteExistingMovie: mockDeleteExistingMovie,
  loading: false,
  movies: [],
  error: null,
  clearMovieError: jest.fn(),
  refreshMovies: jest.fn(),
  createNewMovie: jest.fn(),
  updateExistingMovie: jest.fn(),
};

jest.mock("../../../../core/hooks/useMovieOperations", () => ({
  useMovieOperations: () => mockUseMovieOperations,
}));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock("../../../../shared/components/ui/loaderScreen", () => {
  return function MockLoadScreen({ isLoading, loadingText }: { isLoading: boolean; loadingText: string }) {
    return isLoading ? <div data-testid="mock-load-screen">{loadingText}</div> : null;
  };
});

jest.mock("../style.module.css", () => ({
  container: "mock-container",
  heroImage: "mock-hero-image",
  heroImageBackground: "mock-hero-background",
  poster: "mock-poster"
}));

global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 0);
  return 1;
});
global.cancelAnimationFrame = jest.fn();

global.confirm = jest.fn();
global.alert = jest.fn();

describe("MovieDetail", () => {
  const createMockMovieReducer = (initialState = { movies: [], isLoading: false, error: null }) => {
    return (state = initialState) => state;
  };

  const createMockAuthReducer = (initialState = { user: null, token: null, isAuthenticated: false, isLoading: false, error: null }) => {
    return (state = initialState) => state;
  };

  const renderWithProviders = (routeParams = { id: "1" }) => {
    const store = configureStore({
      reducer: {
        movies: createMockMovieReducer(),
        auth: createMockAuthReducer(),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          thunk: false 
        }),
    });

    mockUseParams.mockReturnValue(routeParams);

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/movies/${routeParams.id}`]}>
          <MantineProvider>
            <MovieDetail />
          </MantineProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadMovieById.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Filme Teste",
        genre: "Ação",
        release_year: 2023,
        synopsis: "Uma sinopse de teste para o filme",
        poster_url: "https://example.com/poster.jpg"
      }
    });
    mockDeleteExistingMovie.mockResolvedValue({ success: true });
  });

  it("should render is equal to snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });

  it("should render loading state initially and load movie data", async () => {
    renderWithProviders({ id: "1" });
    
    expect(screen.getByTestId("mock-load-screen")).toBeInTheDocument();
    expect(screen.getByText("Carregando detalhes do filme...")).toBeInTheDocument();
    
    expect(mockLoadMovieById).toHaveBeenCalledWith(1);
  });

  it("should display movie details when movie data is loaded", async () => {
    const mockMovie = {
      id: 1,
      title: "Vingadores: Ultimato",
      genre: "Ação",
      release_year: 2019,
      synopsis: "Os heróis mais poderosos da Terra enfrentam Thanos.",
      poster_url: "https://example.com/avengers.jpg"
    };

    mockLoadMovieById.mockResolvedValue({
      success: true,
      data: mockMovie
    });

    renderWithProviders({ id: "1" });
    
    await waitFor(() => {
      expect(screen.getByText("Vingadores: Ultimato")).toBeInTheDocument();
    });

    expect(screen.getByText("Os heróis mais poderosos da Terra enfrentam Thanos.")).toBeInTheDocument();
    expect(screen.getByText("Ação")).toBeInTheDocument();
    expect(screen.getByText("Lançamento: 2019")).toBeInTheDocument();
    
    expect(screen.getByText("Editar Filme")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });

  it("should display error message when movie ID is invalid", async () => {
    renderWithProviders({ id: "invalid" });
    
    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar filme")).toBeInTheDocument();
    });

    expect(screen.getByText("ID do filme inválido")).toBeInTheDocument();
    
    expect(screen.getByText("← Voltar para lista")).toBeInTheDocument();
    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
    
    expect(mockLoadMovieById).not.toHaveBeenCalled();
  });

  it("should handle movie deletion when delete button is clicked", async () => {
    const mockMovie = {
      id: 1,
      title: "Filme Para Deletar",
      genre: "Drama",
      release_year: 2023,
      synopsis: "Um filme que será deletado.",
      poster_url: "https://example.com/delete.jpg"
    };

    mockLoadMovieById.mockResolvedValue({
      success: true,
      data: mockMovie
    });

    renderWithProviders({ id: "1" });
    
    await waitFor(() => {
      expect(screen.getByText("Filme Para Deletar")).toBeInTheDocument();
    });

    (global.confirm as jest.Mock).mockReturnValue(true);

    const deleteButton = screen.getByTestId("trash-icon").closest("button");
    expect(deleteButton).toBeInTheDocument();
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    await waitFor(() => {
      expect(mockDeleteExistingMovie).toHaveBeenCalledWith(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/movies");
  });
}); 