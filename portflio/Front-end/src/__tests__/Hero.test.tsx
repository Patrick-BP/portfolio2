import { render, screen } from '@testing-library/react';
import Hero from '../components/sections/Hero';

describe('Hero Section', () => {
  it('renders the Hero section', () => {
    render(<Hero />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
