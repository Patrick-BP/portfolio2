import { render, screen } from '@testing-library/react';
import About from '../components/sections/About';

describe('About Section', () => {
  it('renders the About section', () => {
    render(<About />);
    expect(screen.getByText(/experience/i)).toBeInTheDocument();
    expect(screen.getByText(/education/i)).toBeInTheDocument();
  });
});
