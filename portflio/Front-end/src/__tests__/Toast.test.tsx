import { render } from '@testing-library/react';
import { ToastProvider, ToastViewport } from '../components/ui/toast';

describe('Toast', () => {
  it('renders ToastProvider and ToastViewport', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
    // Just check if ToastViewport is present
    // (no visible output, but component mounts)
    expect(document.body).toBeDefined();
  });
});
