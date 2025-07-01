import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import MantineContainer from '../MantineContainer';

describe('MantineContainer', () => {
  it('Should render children content correctly', () => {
    const { container } = render(
      <MantineProvider>
        <MantineContainer>
          <div>Test content for MantineContainer</div>
        </MantineContainer>
      </MantineProvider>
    );
    
    const content = container.querySelector('div');
    expect(content).toBeInTheDocument();
    expect(content?.innerHTML).toContain('Test content for MantineContainer');
  });

  it('Should match snapshot', () => {
    const { container } = render(
      <MantineProvider>
        <MantineContainer>
          <div>Test content for snapshot</div>
        </MantineContainer>
      </MantineProvider>
    );
    
    expect(container.firstChild).toMatchSnapshot();
  });
}); 