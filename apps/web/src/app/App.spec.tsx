import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import App from '../app/App';

function renderWithStore() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

describe('App', () => {
  it('should render the registration page at root', () => {
    renderWithStore();
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
  });

  it('should render the registration form', () => {
    renderWithStore();
    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
  });
});
