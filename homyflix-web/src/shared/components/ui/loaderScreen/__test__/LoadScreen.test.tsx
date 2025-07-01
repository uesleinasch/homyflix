import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoaderScreen from '..';
import { MantineProvider } from '@mantine/core';

describe('LoaderScreen', () => {
    beforeAll(() => {
        renderWithProvider();
    });

  const renderWithProvider = (props = {}) => {
    return render(
      <MantineProvider>
        <LoaderScreen {...props} />
      </MantineProvider>
    );
  };

  it('Should render correctly with default props', () => {
    const { container } = renderWithProvider();
    expect(container).toMatchSnapshot();
  });

  it('Should not render when isLoading is false', () => {
    const { container } = renderWithProvider({ isLoading: false });
    
    expect(container).not.toContain('LoaderScreen');
  });

  it('Should render correctly when isLoading is true', () => {
    renderWithProvider({ isLoading: true });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-label', 'Carregando aplicação');
    expect(progressbar).toHaveAttribute('aria-busy', 'true');
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('Should render with custom loading text', () => {
    const customText = 'Aguarde um momento...';
    renderWithProvider({ isLoading: true, loadingText: customText });
    
    expect(screen.getByText(customText)).toBeInTheDocument();
    
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('Should have correct CSS classes and structure', () => {
    renderWithProvider({ isLoading: true });
    
    const progressbar = screen.getByRole('progressbar');
    
    expect(progressbar).toHaveClass('overlay');
    
    const loader = progressbar.querySelector('.mantine-Loader-root');
    expect(loader).toBeInTheDocument();
  });
});