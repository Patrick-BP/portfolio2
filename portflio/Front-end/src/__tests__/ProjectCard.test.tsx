import { render, screen } from '@testing-library/react';
import ProjectCard from '../components/ui/ProjectCard';
import type { Project } from '../lib/data';

describe('ProjectCard', () => {
  const mockProject: Project = {
    _id: '1',
    title: 'Test Project',
    description: 'Description',
    thumbnail: 'test.jpg',
    githubUrl: 'https://github.com/example',
    category: 'frontend',
    techStack: ['React', 'TypeScript'],
    liveUrl: 'https://live.example.com',
    featured: true,
  };

  it('renders project details', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/test project/i)).toBeInTheDocument();
    expect(screen.getByAltText(/test project/i)).toBeInTheDocument();
  });

  it('renders github link if present', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByLabelText(/github repository/i)).toBeInTheDocument();
  });
});
