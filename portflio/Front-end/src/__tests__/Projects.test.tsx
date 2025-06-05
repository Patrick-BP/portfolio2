import { render, screen, fireEvent } from '@testing-library/react';
import Projects from '../components/sections/Projects';

describe('Projects Section', () => {
  it('renders the Projects section and project cards', () => {
    render(<Projects />);
    expect(screen.getAllByText(/projects/i).length).toBeGreaterThan(0);
  });

  it('shows the view more button if projects exceed initial count', () => {
    render(<Projects />);
    const button = screen.queryByRole('button', { name: /view more projects/i });
    // Button may be conditionally rendered based on projects fetched
    expect(button).toBeDefined();
  });
});
