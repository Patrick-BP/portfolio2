import { render, screen } from '@testing-library/react';
import Footer from '../components/layout/Footer';

describe('Footer Component', () => {
  it('renders footer content correctly', () => {
    render(<Footer />);
    
    // Test for presence of social media links
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    
    // Test for copyright text
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} All rights reserved.`)).toBeInTheDocument();
  });
});