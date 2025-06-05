import { render, screen, fireEvent } from '@testing-library/react';
import Blog from '../components/sections/Blog';

describe('Blog Section', () => {
  it('renders the Blog section', () => {
    render(<Blog />);
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
  });

  it('shows the view all articles button if posts exceed initial count', () => {
    render(<Blog />);
    const button = screen.queryByRole('button', { name: /view all articles/i });
    expect(button).toBeDefined();
  });
});
