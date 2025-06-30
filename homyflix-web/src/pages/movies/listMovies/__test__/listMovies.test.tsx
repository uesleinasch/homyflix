import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ListMovies from "../listMovies";

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
    getToken: jest.fn(() => null),
    getCurrentUser: jest.fn(() => null),
    isTokenValid: jest.fn(() => false),
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

const mockUseMovieOperations: any = {
  movies: [],
  loading: false,
  error: null,
  deleteExistingMovie: jest.fn(() => Promise.resolve({ success: true })),
  clearMovieError: jest.fn(),
  refreshMovies: jest.fn(() => Promise.resolve({ success: true })),
  loadMovies: jest.fn(() => Promise.resolve({ success: true })),
  createNewMovie: jest.fn(() => Promise.resolve({ success: true })),
  updateExistingMovie: jest.fn(() => Promise.resolve({ success: true })),
  getMovieById: jest.fn(() => () => undefined)
};

jest.mock("../../../../core/hooks/useMovieOperations", () => ({
  useMovieOperations: () => mockUseMovieOperations,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("@phosphor-icons/react", () => ({
  ArrowsCounterClockwiseIcon: () => <button data-testid="refresh-icon">↻</button>,
  InfoIcon: () => <button data-testid="info-icon">ℹ</button>,
  PlusIcon: () => <button data-testid="plus-icon">+</button>,
  FunnelIcon: () => <button data-testid="funnel-icon">🔽</button>,
  MagnifyingGlassIcon: () => <button data-testid="search-icon">🔍</button>,
  EyeIcon: () => <button data-testid="eye-icon">👁</button>,
  PenIcon: () => <button data-testid="pen-icon">✏</button>,
  TrashIcon: () => <button name="trash-icon" data-testid="trash-icon">🗑</button>,
}));

jest.mock("../Components", () => ({
  MovieFilters: function MockMovieFilters({ onFilter }: { onFilter: (filters: any) => void }) {
    return (
      <div data-testid="movie-filters">
        <input
          data-testid="search-input"
          placeholder="Buscar por título..."
          onChange={(e) => onFilter({ search: e.target.value })}
        />
        <button data-testid="filter-button">Filtrar</button>
      </div>
    );
  },
  
  MovieItem: function MockMovieItem({ 
    movie, 
    onView, 
    onEdit, 
    onDelete 
  }: { 
    movie: any; 
    onView: (id: number) => void; 
    onEdit: (id: number) => void; 
    onDelete: (id: number) => void; 
  }) {
    return (
      <div data-testid={`movie-item-${movie.id}`} className="cardContainer">
        <h3>{movie.title}</h3>
        <p>{movie.genre} - {movie.release_year}</p>
        <button onClick={() => onView(movie.id)}>Ver</button>
        <button onClick={() => onEdit(movie.id)}>Editar</button>
        <button onClick={() => onDelete(movie.id)}>Excluir</button>
      </div>
    );
  },
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    reset: jest.fn(),
    setValue: jest.fn(),
    watch: jest.fn(() => ""),
  }),
}));

jest.mock("@mantine/dates", () => ({
  YearPickerInput: ({ placeholder, onChange }: any) => (
    <input
      data-testid="year-picker"
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));

jest.mock("../../../../shared/components/ui/header/Header", () => {
  return function MockHeader({ title, children }: { title: string; children?: React.ReactNode }) {
    return (
      <div data-testid="mock-header">
        <h1>{title}</h1>
        <div data-testid="header-actions">{children}</div>
      </div>
    );
  };
});

jest.mock("../../../../shared/components/ui/loaderScreen", () => {
  return function MockLoadScreen({ isLoading, loadingText }: { isLoading: boolean; loadingText: string }) {
    return isLoading ? <div data-testid="mock-load-screen">{loadingText}</div> : null;
  };
});

jest.mock("../../../../shared/components/ui/mantineContainer/MantineContainer", () => {
  return function MockMantineContainer({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-mantine-container">{children}</div>;
  };
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => ({})),
}));

jest.mock("zod", () => ({
  z: {
    object: jest.fn(() => ({
      optional: jest.fn(() => ({})),
    })),
    string: jest.fn(() => ({
      optional: jest.fn(() => ({})),
    })),
  },
}));

jest.mock("../../../../store/slices/movieSlice", () => {
  const originalModule = jest.requireActual("../../../../store/slices/movieSlice");
  return {
    ...originalModule,
    fetchMovies: {
      ...originalModule.fetchMovies,
      pending: { type: 'movies/fetchMovies/pending' },
      fulfilled: { type: 'movies/fetchMovies/fulfilled' },
      rejected: { type: 'movies/fetchMovies/rejected' }
    },
    fetchMovieById: {
      ...originalModule.fetchMovieById,
      pending: { type: 'movies/fetchMovieById/pending' },
      fulfilled: { type: 'movies/fetchMovieById/fulfilled' },
      rejected: { type: 'movies/fetchMovieById/rejected' }
    },
    createMovie: {
      ...originalModule.createMovie,
      pending: { type: 'movies/createMovie/pending' },
      fulfilled: { type: 'movies/createMovie/fulfilled' },
      rejected: { type: 'movies/createMovie/rejected' }
    },
    updateMovie: {
      ...originalModule.updateMovie,
      pending: { type: 'movies/updateMovie/pending' },
      fulfilled: { type: 'movies/updateMovie/fulfilled' },
      rejected: { type: 'movies/updateMovie/rejected' }
    },
    deleteMovie: {
      ...originalModule.deleteMovie,
      pending: { type: 'movies/deleteMovie/pending' },
      fulfilled: { type: 'movies/deleteMovie/fulfilled' },
      rejected: { type: 'movies/deleteMovie/rejected' }
    }
  };
});

const createMockMovieReducer = (initialState = { movies: [], isLoading: false, error: null }) => {
  return (state = initialState) => state;
};

const createMockAuthReducer = (initialState = { user: null, token: null, isAuthenticated: false, isLoading: false, error: null }) => {
  return (state = initialState) => state;
};

describe("ListMovies", () => {
  const renderWithProviders = () => {
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



    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MantineProvider>
            <ListMovies />
          </MantineProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockUseMovieOperations, {
      movies: [],
      loading: false,
      error: null,
      deleteExistingMovie: jest.fn(() => Promise.resolve({ success: true })),
      clearMovieError: jest.fn(),
      refreshMovies: jest.fn(() => Promise.resolve({ success: true })),
      loadMovies: jest.fn(() => Promise.resolve({ success: true })),
      createNewMovie: jest.fn(() => Promise.resolve({ success: true })),
      updateExistingMovie: jest.fn(() => Promise.resolve({ success: true })),
      getMovieById: jest.fn(() => () => undefined)
    });
  });

  it("should render the component successfully", () => {
    renderWithProviders();
    expect(screen.getByText("Meus Filmes")).toBeInTheDocument();
    expect(screen.getByText("Nenhum filme encontrado.")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Filme")).toBeInTheDocument();
  });

  it("should render movie filters component", () => {
    renderWithProviders();
    
    expect(screen.getByTestId("movie-filters")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("filter-button")).toBeInTheDocument();
  });

  it("should display loading state correctly", () => {
    mockUseMovieOperations.loading = true;
    mockUseMovieOperations.movies = [];
    
    renderWithProviders();
    
    expect(screen.getByTestId("mock-load-screen")).toBeInTheDocument();
    expect(screen.getByText("Carregando meus de filmes...")).toBeInTheDocument();
  });

  it("should display movies when available", () => {
    const mockMovies = [
      { id: 1, title: "Test Movie 1", genre: "Action", release_year: 2023, synopsis: "Test synopsis 1" },
      { id: 2, title: "Test Movie 2", genre: "Drama", release_year: 2024, synopsis: "Test synopsis 2" }
    ];

    mockUseMovieOperations.movies = mockMovies;
    mockUseMovieOperations.loading = false;
    
    renderWithProviders();
    
    expect(screen.getByText("2 filme(s) encontrado(s)")).toBeInTheDocument();
    expect(screen.getByTestId("movie-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("movie-item-2")).toBeInTheDocument();
  });

  it("should display error state correctly", () => {
    mockUseMovieOperations.error = "Erro ao carregar filmes";
    renderWithProviders();
    expect(screen.getByText("Erro ao carregar filmes")).toBeInTheDocument();
  });


  it("should delete movie when delete button is clicked", async () => {
    const mockMovies = [
      { id: 1, title: "Test Movie", genre: "Action", release_year: 2023, synopsis: "Test synopsis" }
    ];
    
    mockUseMovieOperations.movies = mockMovies;
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByTestId("movie-item-1")).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText("Excluir");
    
    window.confirm = jest.fn(() => true);
    
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockUseMovieOperations.deleteExistingMovie).toHaveBeenCalledWith(1);
    });
  });
});