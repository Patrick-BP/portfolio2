import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BlogForm } from '../components/dashboard/BlogForm';
import { createPost, fetchPosts, updatePost, deletePost } from '@/lib/apis';
import { toast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('@/lib/apis', () => ({
  createPost: jest.fn(),
  fetchPosts: jest.fn(() => Promise.resolve([])),
  updatePost: jest.fn(),
  deletePost: jest.fn()
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: {
    // Mock toast as a function with properties
    default: jest.fn().mockReturnValue({
      id: 'mock-id',
      dismiss: jest.fn(),
      update: jest.fn()
    }),
    // Add success and error as methods
    success: jest.fn().mockReturnValue({
      id: 'mock-id',
      dismiss: jest.fn(),
      update: jest.fn()
    }),
    error: jest.fn().mockReturnValue({
      id: 'mock-id',
      dismiss: jest.fn(),
      update: jest.fn()
    })
  }
}));

const mockPost = {
  _id: '1',
  title: 'Test Blog',
  content: 'Test Content',
  excerpt: 'Test Excerpt',
  tags: ['React', 'TypeScript'],
  readTime: '5',
  published: false,
  thumbnail: 'test.jpg'
};

describe('BlogForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPosts as jest.Mock).mockResolvedValue([mockPost]);
  });

  it('renders form elements correctly', () => {
    render(<BlogForm />);
    
    // Test all form elements are present
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/readtime/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publish immediately/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });
});

describe('Form Submission', () => {
  it('handles form submission correctly', async () => {
    (createPost as jest.Mock).mockResolvedValue({
      _id: '1',
      title: 'Test Blog',
      content: 'Test Content'
    });

    render(<BlogForm />);
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Blog' }
    });
    fireEvent.change(screen.getByLabelText(/excerpt/i), {
      target: { value: 'Test Excerpt' }
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test Content' }
    });
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'React,TypeScript' }
    });
    fireEvent.change(screen.getByLabelText(/readtime/i), {
      target: { value: '5' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create post/i }));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Blog',
        excerpt: 'Test Excerpt',
        content: 'Test Content',
        tags: ['React', 'TypeScript'],
        readTime: '5',
        published: false
      }));
      expect(toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Post created successfully"
      });
    });
  });

  it('handles form submission error', async () => {
    const error = new Error('Failed to create blog');
    (createPost as jest.Mock).mockRejectedValue(error);

    render(<BlogForm />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Blog' }
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test Content' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create post/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: expect.any(String),
        variant: "destructive"
      });
    });
  });
});

describe('Post Update', () => {
  it('handles post update correctly', async () => {
    const mockPost = {
      _id: '1',
      title: 'Original Title',
      content: 'Original Content',
      excerpt: 'Original Excerpt',
      tags: ['original'],
      readTime: '3',
      published: false,
      image: 'original.jpg'
    };
    
    (fetchPosts as jest.Mock).mockResolvedValue([mockPost]);
    (updatePost as jest.Mock).mockResolvedValue({ ...mockPost, title: 'Updated Title' });
    
    render(<BlogForm />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Original Title')).toBeInTheDocument();
    });
    
    // Find and click edit button
    const editButton = screen.getByLabelText(/edit post/i);
    fireEvent.click(editButton);
    
    // Update title
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Updated Title' }
    });
    
    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(updatePost).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Title',
        content: 'Original Content',
        excerpt: 'Original Excerpt',
        tags: ['original'],
        readTime: '3',
        published: false,
        image: 'original.jpg'
      }));
      expect(toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Post updated successfully"
      });
    });
  });
});

describe('Post Deletion', () => {
  it('handles post deletion', async () => {
    (deletePost as jest.Mock).mockResolvedValue({ success: true });
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);
    
    render(<BlogForm />);
    
    // Wait for posts to load and find the post title
    await waitFor(() => {
      const postTitle = screen.getByRole('heading', { name: mockPost.title });
      expect(postTitle).toBeInTheDocument();
    });

    // Find and click delete button using aria-label
    const deleteButton = screen.getByRole('button', { name: /delete post/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this post?');
    expect(deletePost).toHaveBeenCalledWith(mockPost._id);
    expect(toast).toHaveBeenCalledWith({
      title: "Success",
      description: "Post deleted successfully"
    });

    confirmSpy.mockRestore();
  });

  it('cancels post deletion when user declines', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => false);
    
    render(<BlogForm />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deletePost).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('handles post deletion error', async () => {
    const error = new Error('Failed to delete post');
    (deletePost as jest.Mock).mockRejectedValue(error);
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);
    
    render(<BlogForm />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    });

    confirmSpy.mockRestore();
  });

  it('handles edit mode cancellation', async () => {
    render(<BlogForm />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    // Find and click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Cancel edit mode
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Verify form is reset
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
  });
});


describe('Image Upload', () => {
  it('handles image upload', async () => {
    render(<BlogForm />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/project image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Check for the image preview
    await waitFor(() => {
      const preview = screen.getByAltText(/preview/i);
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', expect.stringContaining('blob:'));
    });
  });
});


// For error cases
await waitFor(() => {
  expect(toast).toHaveBeenCalledWith({
    title: expect.any(String),
    description: expect.any(String)
  });
});