import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';

describe('AppFunctional Component', () => {
  test('renders without crashing', () => {
    render(<AppFunctional />);
    expect(screen.getByText(/Coordinates/i)).toBeInTheDocument();
  });

  test('initially displays the correct coordinates and step count', () => {
    render(<AppFunctional />);
    expect(screen.getByText(/Coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/You moved 0 times/i)).toBeInTheDocument();
  });

  test('updates coordinates and step count on button click', () => {
    render(<AppFunctional />);

    const leftButton = screen.getByText(/left/i);
    fireEvent.click(leftButton);

    expect(screen.getByText(/Coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/You moved 1 times/i)).toBeInTheDocument();
  });

  test('prevents movement outside the grid', () => {
    render(<AppFunctional />);

    const leftButton = screen.getByText(/left/i);
    fireEvent.click(leftButton); // Move left to (1, 2)
    fireEvent.click(leftButton); // Move left to (0, 2)
    fireEvent.click(leftButton); // Attempt to move left outside the grid

    expect(screen.getByText(/You can't go left/i)).toBeInTheDocument();
  });

  test('resets the game correctly', () => {
    render(<AppFunctional />);

    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(resetButton);

    expect(screen.getByText(/Coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/You moved 0 times/i)).toBeInTheDocument();
  });

  test('handles email input correctly', () => {
    render(<AppFunctional />);

    const emailInput = screen.getByPlaceholderText(/type email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('submits the form with correct payload', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(<AppFunctional />);

    const emailInput = screen.getByPlaceholderText(/type email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://your-server-endpoint.com/api/submit',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', message: expect.any(String) }),
      })
    );

    global.fetch.mockRestore();
  });
});
