import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '../ProfileForm';
import { fetchProfile, updateProfile } from '@/lib/apis';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('@/lib/apis');
jest.mock('@/hooks/use-toast');

// Mock URL.createObjectURL for file previews
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/avatar');
});

describe('ProfileForm', () => {
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (fetchProfile as jest.Mock).mockResolvedValue({
      name: '',
      email: '',
      title: '',
      bio: ''
    });
  });

  it('renders the form correctly', async () => {
    render(<ProfileForm />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    });
  });

  it('handles profile update', async () => {
  const { container } = render(<ProfileForm />);
  // Fill in the form using textbox roles (order: name, title, email, phone, location, bio, linkedin, github, twitter)
  const textboxes = screen.getAllByRole('textbox');
  fireEvent.change(textboxes[0], { target: { value: 'John Doe' } }); // name
  fireEvent.change(textboxes[2], { target: { value: 'john@example.com' } }); // email

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

  await waitFor(() => {
    expect(updateProfile).toHaveBeenCalledWith(expect.any(String), expect.any(FormData));
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Profile saved',
      description: expect.any(String)
    });
  });
});

  it('handles avatar upload and preview', async () => {
  const { container } = render(<ProfileForm />);
  const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
  // Get the hidden input by id
  const input = container.querySelector('#avatar-upload') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
  // AvatarImage src should update
  await waitFor(() => {
    const avatarImg = container.querySelector('img');
    expect(avatarImg).toHaveAttribute('src', 'blob:http://localhost/avatar');
    expect(screen.getByText('avatar.jpg')).toBeInTheDocument();
  });
});

  it('shows loading indicator while saving', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: '', email: '', title: '', bio: '' });
    render(<ProfileForm />);
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Test User' } }); // name
    fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: 'test@example.com' } }); // email
    fireEvent.change(screen.getAllByDisplayValue('')[1], { target: { value: 'test@example.com' } }); // email
    const saveButton = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveButton);
    // Loader2 should appear in Save button while loading
    await waitFor(() => {
      expect(saveButton.querySelector('svg.animate-spin')).toBeInTheDocument();
    });
  });

  it('shows error toast if fetchProfile fails', async () => {
    (fetchProfile as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<ProfileForm />);
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringMatching(/error/i) }));
    });
  });

  it('renders with pre-filled profile data', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({
      name: 'Jane',
      email: 'jane@example.com',
      title: 'Dev',
      bio: 'Hello',
      phone: '123',
      location: 'Earth',
      avatar: 'avatar.png',
      linkedin: 'janeln',
      github: 'janegit',
      twitter: 'janetw',
      resumeUrl: 'resume.pdf',
      resumeName: 'resume.pdf'
    });
    render(<ProfileForm />);
    expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dev')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Earth')).toBeInTheDocument();
    expect(screen.getByAltText(/avatar/i)).toBeInTheDocument();
  });

  it('handles resume upload and preview', async () => {
  const { container } = render(<ProfileForm />);
  const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
  // Get the hidden input by id
  const input = container.querySelector('#resume-upload') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
  await waitFor(() => {
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });
});

  it('handles updateProfile error', async () => {
    (updateProfile as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<ProfileForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Error' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringMatching(/error/i) }));
    });
  });

  it('handles reset/cancel button', async () => {
    const { container } = render(<ProfileForm />);
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'ResetMe' } });
    fireEvent.click(screen.getByText(/reset/i));
    expect(textboxes[0]).toHaveValue('');
  });

  it('handles all fields editing and submit', async () => {
    const { container } = render(<ProfileForm />);
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'All Fields' } }); // name
    fireEvent.change(textboxes[1], { target: { value: 'Engineer' } }); // title
    fireEvent.change(textboxes[2], { target: { value: 'all@example.com' } }); // email
    fireEvent.change(textboxes[3], { target: { value: '555' } }); // phone
    fireEvent.change(textboxes[4], { target: { value: 'Moon' } }); // location
    fireEvent.change(textboxes[5], { target: { value: 'Bio' } }); // bio
    fireEvent.change(textboxes[6], { target: { value: 'ln' } }); // linkedin
    fireEvent.change(textboxes[7], { target: { value: 'gh' } }); // github
    fireEvent.change(textboxes[8], { target: { value: 'tw' } }); // twitter
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Profile saved' }));
    });
  });

  it('shows validation error if name or email is empty', async () => {
    const { container } = render(<ProfileForm />);
    const saveButton = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringMatching(/validation error/i) }));
    });
  });

  it('shows error if avatar is not image or too large', async () => {
    const { container } = render(<ProfileForm />);
    // Not image
    const badFile = new File(['bad'], 'bad.txt', { type: 'text/plain' });
    const avatarInput = container.querySelector('#avatar-upload') as HTMLInputElement;
    fireEvent.change(avatarInput, { target: { files: [badFile] } });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Invalid file type' }));
    });
    // Too large
    const bigFile = new File(['a'.repeat(3 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(bigFile, 'size', { value: 3 * 1024 * 1024 });
    fireEvent.change(avatarInput, { target: { files: [bigFile] } });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'File too large' }));
    });
  });

  it('shows error if resume is not PDF or too large', async () => {
    const { container } = render(<ProfileForm />);
    // Not PDF
    const badFile = new File(['bad'], 'bad.txt', { type: 'text/plain' });
    const resumeInput = container.querySelector('#resume-upload') as HTMLInputElement;
    fireEvent.change(resumeInput, { target: { files: [badFile] } });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Invalid file type' }));
    });
    // Too large
    const bigFile = new File(['a'.repeat(6 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });
    fireEvent.change(resumeInput, { target: { files: [bigFile] } });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'File too large' }));
    });
  });

  it('renders with avatar and resumeUrl', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({
      name: 'Jane',
      email: 'jane@example.com',
      title: 'Dev',
      bio: 'Hello',
      phone: '123',
      location: 'Earth',
      avatar: 'avatar.png',
      linkedin: 'janeln',
      github: 'janegit',
      twitter: 'janetw',
      resumeUrl: 'https://test.com/files/resume.pdf',
      resumeName: 'resume.pdf'
    });
    const { container } = render(<ProfileForm />);
    expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
    const avatarImg = await screen.findByRole('img');
expect(avatarImg).toHaveAttribute('src', 'avatar.png');
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it('shows "No resume uploaded yet" if resumeUrl is missing', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: '', email: '', title: '', bio: '' });
    render(<ProfileForm />);
    expect(await screen.findByText(/no resume uploaded yet/i)).toBeInTheDocument();
  });

  it('shows avatar fallback with first letter of name', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: 'Zoe', avatar: '' });
    render(<ProfileForm />);
    expect(await screen.findByText('Z')).toBeInTheDocument();
  });

  it('shows avatar fallback with "P" if no name', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: '', avatar: '' });
    render(<ProfileForm />);
    expect(await screen.findByText('P')).toBeInTheDocument();
  });

  it('prevents double submit while loading', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: '', email: '', title: '', bio: '' });
    render(<ProfileForm />);
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Test User' } });
    fireEvent.change(textboxes[2], { target: { value: 'test@example.com' } });
    const saveButton = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
    fireEvent.click(saveButton);
    expect(updateProfile).toHaveBeenCalledTimes(1);
  });

  it('disables file inputs while loading', async () => {
    (fetchProfile as jest.Mock).mockResolvedValue({ name: '', email: '', title: '', bio: '' });
    render(<ProfileForm />);
    const saveButton = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveButton);
    expect(screen.getByLabelText(/upload avatar/i)).toBeDisabled();
    expect(screen.getByLabelText(/upload resume/i)).toBeDisabled();
  });

  it('shows error toast if updateProfile throws string error', async () => {
    (updateProfile as jest.Mock).mockRejectedValueOnce('fail');
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Test User' } });
    fireEvent.change(textboxes[2], { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringMatching(/error/i) }));
    });
  });

  it('shows error toast if updateProfile throws error with response', async () => {
    (updateProfile as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Custom error' } } });
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Test User' } });
    fireEvent.change(textboxes[2], { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Custom error' }));
    });
  });
});
