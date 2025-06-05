import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectForm } from '../components/dashboard/ProjectForm';
import { fetchProjects, createProject, updateProject, deleteProject } from '@/lib/apis';
import { toast } from 'sonner';

// Mock the dependencies
jest.mock('@/lib/apis', () => ({
  fetchProjects: jest.fn(() => Promise.resolve([])),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('ProjectForm Component', () => {
  const mockProjects = [
    {
      _id: '1',
      title: 'Test Project',
      description: 'Test Description',
      techStack: ['React', 'TypeScript'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    },
    {
      _id: '123',
      title: 'Delete Me',
      description: 'To be deleted',
      techStack: ['Node.js'],
      githubUrl: '',
      liveUrl: ''
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchProjects as jest.Mock).mockResolvedValue(mockProjects);
  });

  it('renders form elements correctly', async () => {
    render(<ProjectForm />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/github url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/live demo url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tech stack/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add project/i })).toBeInTheDocument();
    });
  });

  it('handles form submission correctly', async () => {
    (createProject as jest.Mock).mockResolvedValue({
      _id: '2',
      title: 'Test Project',
      description: 'Test Description',
      techStack: ['React', 'TypeScript']
    });

    render(<ProjectForm />);
    
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/project title/i), {
        target: { value: 'Test Project' }
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test Description' }
      });
      fireEvent.change(screen.getByLabelText(/tech stack/i), {
        target: { value: 'React,TypeScript' }
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /add project/i }));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Project',
        description: 'Test Description',
        techStack: ['React', 'TypeScript']
      }));
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }));
    });
  });

  it('displays error toast on submission failure', async () => {
    const error = new Error('Error creating project');
    (createProject as jest.Mock).mockRejectedValueOnce(error);

    render(<ProjectForm />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: 'Test Project' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add project/i });
    fireEvent.click(submitButton);

    // Wait for the error toast
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Error' }));
    }, { timeout: 3000 });
  });
});