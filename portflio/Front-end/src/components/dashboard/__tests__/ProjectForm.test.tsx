import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectForm } from '../ProjectForm';
import { fetchProjects, createProject, updateProject, deleteProject } from '@/lib/apis';
import { toast } from 'sonner';

// Mock the dependencies
jest.mock('@/lib/apis');
jest.mock('sonner');

describe('ProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchProjects as jest.Mock).mockResolvedValue([]);
  });

  it('renders the form correctly', () => {
    render(<ProjectForm />);
    
    expect(screen.getByPlaceholderText(/project title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/github url/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/live url/i)).toBeInTheDocument();
  });

  it('handles project creation', async () => {
    render(<ProjectForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/project title/i), {
      target: { value: 'Test Project' }
    });
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Test Description' }
    });
    fireEvent.change(screen.getByPlaceholderText(/tech stack/i), {
      target: { value: 'React,Node.js' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Project',
        description: 'Test Description',
        techStack: ['React', 'Node.js']
      }));
      expect(toast.success).toHaveBeenCalledWith('Project added successfully');
    });
  });

  it('handles project deletion', async () => {
    const mockProject = {
      _id: '123',
      title: 'Test Project',
      description: 'Test Description',
      techStack: ['React']
    };
    
    (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
    
    render(<ProjectForm />);
    
    // Confirm deletion
    window.confirm = jest.fn(() => true);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('delete-project-123'));
    });

    expect(deleteProject).toHaveBeenCalledWith('123');
    expect(toast.success).toHaveBeenCalledWith('Project deleted successfully');
  });
});
it('handles editing and updating a project', async () => {
  const mockProject = {
    _id: '1',
    title: 'Edit Me',
    description: 'Desc',
    githubUrl: 'https://github.com/edit',
    liveUrl: '',
    techStack: ['React'],
    category: 'frontend',
    thumbnail: 'img.png',
  };
  (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
  render(<ProjectForm />);
  await waitFor(() => {
    expect(screen.getByText('Edit Me')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText(/edit/i));
  expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText(/project title/i), { target: { value: 'Updated Project' } });
  fireEvent.click(screen.getByText(/update project/i));
  await waitFor(() => {
    expect(updateProject).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Updated Project' }));
    expect(toast.success).toHaveBeenCalledWith('Project updated successfully');
  });
});

it('shows image preview when uploading', async () => {
  render(<ProjectForm />);
  const file = new File(['img'], 'img.png', { type: 'image/png' });
  const input = screen.getByLabelText(/project image/i);
  fireEvent.change(input, { target: { files: [file] } });
  await waitFor(() => {
    expect(screen.getByAltText(/project preview/i)).toBeInTheDocument();
  });
});

it('shows image upload fallback', () => {
  render(<ProjectForm />);
  expect(screen.getByText(/upload a screenshot/i)).toBeInTheDocument();
});

it('resets file input and preview on cancel', async () => {
  const mockProject = {
    _id: '1', title: 'Edit Me', description: 'Desc', githubUrl: '', liveUrl: '', techStack: ['React'], category: 'frontend', thumbnail: 'img.png',
  };
  (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
  render(<ProjectForm />);
  await waitFor(() => screen.getByText('Edit Me'));
  fireEvent.click(screen.getByText(/edit/i));
  fireEvent.click(screen.getByText(/cancel/i));
  expect(screen.getByPlaceholderText(/project title/i)).toHaveValue('');
});

it('shows error toast on createProject API error', async () => {
  (createProject as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Create failed' } } });
  render(<ProjectForm />);
  fireEvent.change(screen.getByPlaceholderText(/project title/i), { target: { value: 'Title' } });
  fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Desc' } });
  fireEvent.change(screen.getByPlaceholderText(/tech stack/i), { target: { value: 'React' } });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Create failed');
  });
});

it('shows error toast on updateProject API error', async () => {
  const mockProject = {
    _id: '1', title: 'Edit Me', description: 'Desc', githubUrl: '', liveUrl: '', techStack: ['React'], category: 'frontend', thumbnail: 'img.png',
  };
  (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
  (updateProject as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Update failed' } } });
  render(<ProjectForm />);
  await waitFor(() => screen.getByText('Edit Me'));
  fireEvent.click(screen.getByText(/edit/i));
  fireEvent.click(screen.getByText(/update project/i));
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Update failed');
  });
});

it('shows error toast on deleteProject API error', async () => {
  const mockProject = {
    _id: '1', title: 'Edit Me', description: 'Desc', githubUrl: '', liveUrl: '', techStack: ['React'], category: 'frontend', thumbnail: 'img.png',
  };
  (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
  (deleteProject as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Delete failed' } } });
  render(<ProjectForm />);
  await waitFor(() => screen.getByText('Edit Me'));
  window.confirm = jest.fn(() => true);
  fireEvent.click(screen.getByText(/delete/i));
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Delete failed');
  });
});

it('shows loading spinner when loading', async () => {
  (fetchProjects as jest.Mock).mockImplementation(() => new Promise(() => {}));
  render(<ProjectForm />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

it('disables save button while saving', async () => {
  render(<ProjectForm />);
  fireEvent.change(screen.getByPlaceholderText(/project title/i), { target: { value: 'Title' } });
  fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Desc' } });
  fireEvent.change(screen.getByPlaceholderText(/tech stack/i), { target: { value: 'React' } });
  fireEvent.change(screen.getByPlaceholderText(/github url/i), { target: { value: 'https://github.com' } });
  fireEvent.change(screen.getByPlaceholderText(/live url/i), { target: { value: 'https://demo.com' } });
  fireEvent.click(screen.getByText(/save/i));
  expect(screen.getByText(/saving/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
});

it('selects a category', async () => {
  render(<ProjectForm />);
  fireEvent.mouseDown(screen.getByText(/select a category/i));
  fireEvent.click(screen.getByText(/frontend/i));
  expect(screen.getByText(/frontend/i)).toBeInTheDocument();
});

it('cancels delete when not confirmed', async () => {
  const mockProject = {
    _id: '1', title: 'Edit Me', description: 'Desc', githubUrl: '', liveUrl: '', techStack: ['React'], category: 'frontend', thumbnail: 'img.png',
  };
  (fetchProjects as jest.Mock).mockResolvedValue([mockProject]);
  render(<ProjectForm />);
  await waitFor(() => screen.getByText('Edit Me'));
  window.confirm = jest.fn(() => false);
  fireEvent.click(screen.getByText(/delete/i));
  expect(deleteProject).not.toHaveBeenCalled();
});

it('handles multiple projects edit/delete', async () => {
  const projects = [
    { _id: '1', title: 'A', description: 'A', githubUrl: '', liveUrl: '', techStack: ['React'], category: 'frontend', thumbnail: '' },
    { _id: '2', title: 'B', description: 'B', githubUrl: '', liveUrl: '', techStack: ['Vue'], category: 'backend', thumbnail: '' },
  ];
  (fetchProjects as jest.Mock).mockResolvedValue(projects);
  render(<ProjectForm />);
  await waitFor(() => screen.getByText('A'));
  await waitFor(() => screen.getByText('B'));
  // Edit second
  fireEvent.click(screen.getAllByText(/edit/i)[1]);
  expect(screen.getByDisplayValue('B')).toBeInTheDocument();
  // Delete first
  window.confirm = jest.fn(() => true);
  fireEvent.click(screen.getAllByText(/delete/i)[0]);
  expect(deleteProject).toHaveBeenCalledWith('1');
});