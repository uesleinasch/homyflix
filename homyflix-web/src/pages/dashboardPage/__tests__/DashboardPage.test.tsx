import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@testing-library/jest-dom";
import DashboardPage from "../DashboardPage";

// Mock dos hooks
jest.mock("../../../core/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../core/hooks/useMovieOperations", () => ({
  useMovieOperations: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock("../../../shared/components/ui/mantineContainer/MantineContainer", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../components/dashboardMovieCard/DashboardMovieCard", () => ({
  __esModule: true,
  default: ({ movie, onClick }: any) => (
    <div onClick={onClick} data-testid={`movie-card-${movie.id}`}>
      <span>{movie.title}</span>
      <span>{movie.release_year}</span>
      <span>{movie.genre}</span>
    </div>
  ),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MantineProvider>
        <Notifications />
        {component}
      </MantineProvider>
    </BrowserRouter>
  );
};

describe("DashboardPage", () => {
  const mockUser = {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
  };

  const mockMovies = [
    {
      id: 1,
      title: "Inception",
      release_year: 2010,
      genre: "Ficção Científica",
      created_at: "2024-01-15T10:00:00Z",
      poster_url: "https://example.com/inception.jpg",
    },
    {
      id: 2,
      title: "The Matrix",
      release_year: 1999,
      genre: "Ação",
      created_at: "2024-01-14T10:00:00Z",
      poster_url: "https://example.com/matrix.jpg",
    },
    {
      id: 3,
      title: "Interstellar",
      release_year: 2014,
      genre: "Drama",
      created_at: "2024-01-13T10:00:00Z",
      poster_url: "https://example.com/interstellar.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    const { useAuth } = require("../../../core/hooks/useAuth");
    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });

    const { useMovieOperations } = require("../../../core/hooks/useMovieOperations");
    useMovieOperations.mockReturnValue({
      movies: mockMovies,
      loading: false,
    });
  });

  it("deve renderizar o dashboard com as informações do usuário", () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(`Bem-vindo de volta, ${mockUser.name}!`)).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("deve renderizar os cards de ação (Meus Filmes e Adicionar Filme)", () => {
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("Meus Filmes")).toBeInTheDocument();
    expect(screen.getByText("Visualizar e gerenciar todos os filmes cadastrados")).toBeInTheDocument();
    
    expect(screen.getByText("Adicionar Filme")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar um novo filme na sua biblioteca")).toBeInTheDocument();
    
    const acessarButtons = screen.getAllByText("Acessar");
    expect(acessarButtons).toHaveLength(2);
  });

  it("deve renderizar os últimos filmes adicionados e navegar ao clicar", async () => {
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText("Últimos adicionados")).toBeInTheDocument();
    
    expect(screen.getByText("Ver todos")).toBeInTheDocument();
    
    expect(screen.getByTestId("movie-card-1")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("movie-card-1"));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/movies/1");
    });
  });

  it("deve exibir mensagem quando não há filmes cadastrados", () => {
    // Mock sem filmes
    const { useMovieOperations } = require("../../../core/hooks/useMovieOperations");
    useMovieOperations.mockReturnValue({
      movies: [],
      loading: false,
    });

    renderWithProviders(<DashboardPage />);
    expect(screen.getByText("Nenhum filme cadastrado ainda.")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar primeiro filme")).toBeInTheDocument();
  });
}); 