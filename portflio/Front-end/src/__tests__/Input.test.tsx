import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../components/ui/input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText(/type here/i)).toBeInTheDocument();
  });
  it('handles value change', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText(/type here/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });
});
