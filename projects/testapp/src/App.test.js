import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  expect(screen.getByText(/todo list/i)).toBeInTheDocument();
});

test('adds a todo item', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/enter a task/i);
  const addBtn = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: 'Learn Testing' } });
  fireEvent.click(addBtn);

  expect(screen.getByText('Learn Testing')).toBeInTheDocument();
});

test('deletes a todo item', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/enter a task/i);
  const addBtn = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: 'Delete Me' } });
  fireEvent.click(addBtn);

  expect(await screen.findByText('Delete Me')).toBeInTheDocument();

  const deleteBtn = screen.getByText('Delete');
  fireEvent.click(deleteBtn);

  await waitFor(() => {
    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
  });
});
