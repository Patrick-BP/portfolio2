import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessagesList } from '../components/dashboard/MessagesList';
import { fetchMessages, updateMessage, deleteMessage } from '@/lib/apis';
import { toast } from 'sonner';

jest.mock('@/lib/apis', () => ({
  fetchMessages: jest.fn(),
  updateMessage: jest.fn(),
  deleteMessage: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('MessagesList Component', () => {
  const mockMessages = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
      createdAt: '2023-01-01T00:00:00.000Z',
      read: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchMessages as jest.Mock).mockResolvedValue(mockMessages);
  });

  it('renders messages list correctly', async () => {
    render(<MessagesList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
  });

  it('handles marking message as read', async () => {
    (updateMessage as jest.Mock).mockResolvedValue({ success: true });
    render(<MessagesList />);
    
    await waitFor(() => {
      const markAsReadButton = screen.getByRole('button', { name: /mark as read/i });
      fireEvent.click(markAsReadButton);
    });
    
    expect(updateMessage).toHaveBeenCalledWith('1', { read: true });
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }));
  });

  it('handles message deletion', async () => {
    window.confirm = jest.fn(() => true);
    render(<MessagesList />);
    
    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
    });
    
    expect(deleteMessage).toHaveBeenCalledWith('1');
  });

  it('handles reply action', async () => {
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    render(<MessagesList />);
    
    await waitFor(() => {
      const replyButton = screen.getByRole('button', { name: /reply/i });
      fireEvent.click(replyButton);
    });
    
    expect(window.location.href).toBe('mailto:john@example.com');
  });
});