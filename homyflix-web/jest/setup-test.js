// Setup para testes com Jest e React Testing Library
import '@testing-library/jest-dom';

// Polyfill para TextEncoder/TextDecoder (necessário para alguns módulos)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock do IntersectionObserver (necessário para alguns componentes Mantine)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock do ResizeObserver (necessário para alguns componentes Mantine)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock do matchMedia (necessário para testes de responsividade)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do getComputedStyle (necessário para alguns componentes)
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => {
      return '';
    }
  })
});

// Mock do scrollTo (necessário para alguns testes)
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock do Image (necessário para testes de preview de imagem)
global.Image = class {
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    });
  }
};

// Mock do URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Configuração global para testes
beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
  
  // Limpar localStorage e sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Resetar mocks de URL
  URL.createObjectURL.mockReset();
  URL.revokeObjectURL.mockReset();
});

// Configuração para suprimir warnings desnecessários em testes
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: useLayoutEffect does nothing on the server'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock do import.meta.env (Vite)
global.importMeta = {
  env: {
    PROD: false,
    DEV: true,
    MODE: 'test',
    BASE_URL: '/',
    VITE_API_URL: 'http://localhost:8000/api'
  }
};

// Polyfill para import.meta
Object.defineProperty(global, 'import.meta', {
  value: global.importMeta
});

// Timeout global para testes assíncronos
jest.setTimeout(10000);

// Extensões personalizadas do Jest
expect.extend({
  toHaveBeenCalledWithMatch(received, ...expected) {
    const pass = received.mock.calls.some(call =>
      expected.every((arg, index) =>
        typeof arg === 'object'
          ? expect.objectContaining(arg).asymmetricMatch(call[index])
          : arg === call[index]
      )
    );

    return {
      pass,
      message: () =>
        `expected ${received.getMockName()} to have been called with arguments matching ${expected.join(', ')}`,
    };
  },
});
