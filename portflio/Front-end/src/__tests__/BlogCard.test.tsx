import { render, screen } from '@testing-library/react';
import BlogCard from '../components/ui/BlogCard';

describe('BlogCard', () => {
  const mockPost = {
    _id: '1',
    title: 'Test Blog',
    excerpt: 'Excerpt',
    thumbnail: 'test.jpg',
    tags: ['React'],
    published: true,
    createdAt: new Date().toISOString(),
    author: 'Author',
    readTime: 3,
  };

  it('renders blog details', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(/test blog/i)).toBeInTheDocument();
    expect(screen.getByAltText(/test blog/i)).toBeInTheDocument();
  });
});
