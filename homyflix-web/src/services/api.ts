import axios from 'axios';

/**
 * Instância do Axios para comunicação com a API.
 *
 * A baseURL é configurada a partir de variáveis de ambiente (VITE_API_URL)
 * com um fallback para o ambiente de desenvolvimento local.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor de requisição para adicionar o token de autenticação JWT.
 *
 * O token é recuperado do localStorage e adicionado ao cabeçalho 'Authorization'
 * em todas as requisições para rotas protegidas.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
