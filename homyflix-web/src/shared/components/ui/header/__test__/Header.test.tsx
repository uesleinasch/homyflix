import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Header from '../Header';
import { MantineProvider } from '@mantine/core';

describe('Header', () => {
  it('Should render correctly', () => {
    const { container } = render(
        <MantineProvider>
            <Header title="Test Header" />
        </MantineProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Should render children content correctly', () => {
    const { container } = render(
        <MantineProvider>
            <Header title="Test Header">
                <div>Test content for Header</div>
            </Header>
        </MantineProvider>
    );
    expect(container).toHaveTextContent('Test content for Header');
  });
});