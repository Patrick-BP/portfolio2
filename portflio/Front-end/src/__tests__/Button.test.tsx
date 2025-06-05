import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText(/click/i));
    expect(handleClick).toHaveBeenCalled();
  });
});
