import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BlogForm } from '../BlogForm';
import { fetchPosts, createPost, updatePost, deletePost } from '@/lib/apis';
import { toast } from 'sonner';

jest.mock('@/lib/apis');
jest.mock('sonner');

// Mock scrollIntoView for JSDOM test environment
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('BlogForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPosts as jest.Mock).mockResolvedValue([]);
  });

  it('renders the form correctly', () => {
    render(<BlogForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/blog image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publish immediately/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/readtime/i)).toBeInTheDocument();
  });

  it('renders empty state when no posts', async () => {
    (fetchPosts as jest.Mock).mockResolvedValue([]);
    render(<BlogForm />);
    await waitFor(() => {
      expect(screen.getAllByText(/no blog posts found/i).length).toBe(2);
    });
  });

  it('handles form submission for new blog post', async () => {
    const expectedPost = {
      title: 'Test Blog',
      content: 'Test Content',
      excerpt: 'Test Excerpt',
      tags: ['test', 'blog']
    };
  
    (createPost as jest.Mock).mockResolvedValue({
      _id: '1',
      ...expectedPost,
      createdAt: new Date().toISOString()
    });
  
    render(<BlogForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Blog' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByLabelText(/excerpt/i), { target: { value: 'Test Excerpt' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'test,blog' } });
    fireEvent.change(screen.getByLabelText(/readtime/i), { target: { value: 5 } });
    fireEvent.click(screen.getByLabelText(/publish immediately/i));
    fireEvent.click(screen.getByText(/create post/i));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Blog',
        content: 'Test Content',
        excerpt: 'Test Excerpt',
        tags: ['test', 'blog']
      }));
      expect(toast.success).toHaveBeenCalledWith('Post added successfully');
    });
  });

  it('handles image upload and preview', async () => {
    render(<BlogForm />);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const numberInput = screen.getByLabelText(/readtime/i);
    fireEvent.change(numberInput, { target: { value: 10 } });
    expect(numberInput).toHaveValue(10);
    const input = screen.getByLabelText(/blog image/i);
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByAltText(/project preview/i)).toBeInTheDocument();
    });
  });

  it('renders unpublished and published posts and handles edit and status badge', async () => {
    const posts = [
      { _id: '1', title: 'Draft', content: '...', excerpt: '...', tags: ['a'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' },
      { _id: '2', title: 'Pub', content: '...', excerpt: '...', tags: ['b'], published: true, publishedAt: new Date().toISOString(), thumbnail: '', readTime: 2, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    // Wait for both posts
    await screen.findByText('Draft');
    await screen.findByText('Pub');
    // Check published/unpublished status by badge or text
    expect(await screen.findAllByText(/unpublished/i)).toHaveLength(1);
    expect(await screen.findAllByText(/published/i)).toHaveLength(1);
    // Edit unpublished
    fireEvent.click(screen.getByTestId('edit-post-1'));
    expect(screen.getByDisplayValue('Draft')).toBeInTheDocument();
    // Edit published
    fireEvent.click(screen.getByTestId('edit-post-2'));
    expect(screen.getByDisplayValue('Pub')).toBeInTheDocument();
  });

  it('handles updatePost when editing', async () => {
    const posts = [
      { _id: '1', title: 'EditMe', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    (updatePost as jest.Mock).mockResolvedValue({});
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('EditMe')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-post-1'));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Edited' } });
    fireEvent.click(screen.getByText(/update post/i));
    await waitFor(() => {
      expect(updatePost).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Blog post updated successfully');
    });
  });

  it('handles updatePost error', async () => {
    const posts = [
      { _id: '1', title: 'EditErr', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    (updatePost as jest.Mock).mockRejectedValue({ message: 'Update failed' });
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('EditErr')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-post-1'));
    fireEvent.click(screen.getByText(/update post/i));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('handles deletePost success and error', async () => {
    window.confirm = jest.fn(() => true);
    const posts = [
      { _id: '1', title: 'DelMe', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    (deletePost as jest.Mock).mockResolvedValue({});
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('DelMe')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('delete-post-1'));
    await waitFor(() => {
      expect(deletePost).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Blog post deleted successfully');
    });
    // Error path
    (deletePost as jest.Mock).mockRejectedValue({ message: 'Delete failed' });
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('DelMe')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('delete-post-1'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Delete failed');
    });
  });

  it('cancels deletePost if confirm is false', async () => {
    window.confirm = jest.fn(() => false);
    const posts = [
      { _id: '1', title: 'DelNo', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('DelNo')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('delete-post-1'));
    expect(deletePost).not.toHaveBeenCalled();
  });

  it('shows correct image upload description in edit mode', async () => {
    const posts = [
      { _id: '1', title: 'EditImg', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: 'img.png', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    await waitFor(() => expect(screen.getByText('EditImg')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-post-1'));
    expect(screen.getByText(/current image shown/i)).toBeInTheDocument();
  });

  it('handles posts with tags and without images', async () => {
    const posts = [
      { _id: '1', title: 'Taggy', content: '...', excerpt: '...', tags: ['x', 'y'], published: false, publishedAt: '', thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    await waitFor(() => {
      expect(screen.getByText('Taggy')).toBeInTheDocument();
      expect(screen.getByText('x')).toBeInTheDocument();
      expect(screen.getByText('y')).toBeInTheDocument();
    });
  });

  it('handles posts with images', async () => {
    const posts = [
      { _id: '1', title: 'Imgy', content: '...', excerpt: '...', tags: ['x'], published: false, publishedAt: '', thumbnail: 'img.png', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    await waitFor(() => {
      expect(screen.getByAltText('Imgy')).toBeInTheDocument();
    });
  });

  it('handles published posts with publishedAt', async () => {
    const posts = [
      { _id: '1', title: 'PubAt', content: '...', excerpt: '...', tags: ['x'], published: true, publishedAt: new Date().toISOString(), thumbnail: '', readTime: 1, publishedBy: '' }
    ];
    (fetchPosts as jest.Mock).mockResolvedValue(posts);
    render(<BlogForm />);
    await screen.findByText('PubAt');
    // Check that 'Published' badge/text is present within the PubAt post card only
    const postCard = await screen.findByText('PubAt');
    // Find the nearest card/container
    const card = postCard.closest('div');
    // Search for 'Published' within this card
    // Use within() from @testing-library/react
    const { within } = require('@testing-library/react');
    expect(within(card).getByText(/published/i)).toBeInTheDocument();
  });
});