import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../app/App';

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />);
    expect(screen.getByText(/Tidy - Project Management/i)).toBeInTheDocument();
  });

  it('should display welcome message', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to your new Nx monorepo workspace/i)).toBeInTheDocument();
  });

  it('should test shared types import', () => {
    render(<App />);
    expect(screen.getByText(/Testing Shared Types Import/i)).toBeInTheDocument();
  });
});
