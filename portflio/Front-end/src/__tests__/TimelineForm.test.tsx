import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TimelineForm } from '../components/dashboard/TimeLineForm';
import { fetchTimeLine, updateTimeLine, deleteTimeLine } from '@/lib/apis';
import { toast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('@/lib/apis', () => ({
  fetchTimeLine: jest.fn(() => Promise.resolve([])),
  updateTimeLine: jest.fn(),
  deleteTimeLine: jest.fn()
}));

const toastMock = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock })
}));

describe('TimelineForm Component', () => {
  const mockTimelineItems = [
    {
      _id: '1',
      order: 1,
      dateRange: '2023-2024',
      title: 'Test Title',
      company: 'Test Company',
      description: 'Test Description',
      skills: ['React', 'TypeScript']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchTimeLine as jest.Mock).mockResolvedValue(mockTimelineItems);
  });

  it('renders form elements correctly', async () => {
    render(<TimelineForm />);
    
    await waitFor(() => {
      expect(screen.getByText(/manage timeline/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add timeline entry/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save timeline/i })).toBeInTheDocument();
      expect(screen.getByText(/timeline entry 1/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  it('handles adding new timeline item', async () => {
    render(<TimelineForm />);
    
    const addButton = screen.getByRole('button', { name: /add timeline entry/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getAllByText(/timeline entry/i)).toHaveLength(2);
    });
  });

  it('handles removing timeline item', async () => {
    render(<TimelineForm />);
    
    await waitFor(() => {
      const deleteButton = screen.getByTestId(`delete-timeline-${mockTimelineItems[0]._id}`);
      fireEvent.click(deleteButton);
    });

    expect(deleteTimeLine).toHaveBeenCalledWith(mockTimelineItems[0]._id);
  });

  it('handles updating timeline item fields', async () => {
    render(<TimelineForm />);
    
    await waitFor(() => {
      const titleInput = screen.getByDisplayValue('Test Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      
      const companyInput = screen.getByDisplayValue('Test Company');
      fireEvent.change(companyInput, { target: { value: 'Updated Company' } });
      
      const descriptionInput = screen.getByDisplayValue('Test Description');
      fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    });

    const saveButton = screen.getByRole('button', { name: /save timeline/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTimeLine).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Updated Title',
          company: 'Updated Company',
          description: 'Updated Description'
        })
      ]));
    });
  });

  it('handles adding new technology', async () => {
    render(<TimelineForm />);
    
    const techInput = await screen.findByPlaceholderText(/add technology/i);
    fireEvent.change(techInput, { target: { value: 'Node.js' } });
    const addTechButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addTechButton);
    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  it('handles removing technology', async () => {
    render(<TimelineForm />);
    
    await waitFor(() => {
      const removeButtons = screen.getAllByText('×');
      fireEvent.click(removeButtons[0]);
    });

    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('handles save timeline success', async () => {
    (updateTimeLine as jest.Mock).mockResolvedValue(mockTimelineItems);
    
    render(<TimelineForm />);
    
    const saveButton = screen.getByRole('button', { name: /save timeline/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTimeLine).toHaveBeenCalled();
      expect(toastMock).toHaveBeenCalledWith({
        title: "Timeline saved",
        description: "Your timeline has been updated successfully."
      });
    });
  });

  it('handles save timeline error', async () => {
    const error = new Error('Failed to save timeline');
    (updateTimeLine as jest.Mock).mockRejectedValue(error);
    
    render(<TimelineForm />);
    
    const saveButton = screen.getByRole('button', { name: /save timeline/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: "Error saving timeline",
        description: "Failed to save timeline",
        variant: "destructive"
      });
    });
  });

  it('handles adding technology with Enter key', async () => {
    render(<TimelineForm />);
    
    const techInput = await screen.findByPlaceholderText(/add technology/i);
    fireEvent.change(techInput, { target: { value: 'Vue.js' } });
    fireEvent.keyPress(techInput, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('Vue.js')).toBeInTheDocument();
    });
  });
});