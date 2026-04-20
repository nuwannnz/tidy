import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from './RegistrationForm';

function renderForm(props?: Partial<React.ComponentProps<typeof RegistrationForm>>) {
  const onSubmit = jest.fn();
  render(<RegistrationForm onSubmit={onSubmit} {...props} />);
  return { onSubmit };
}

describe('RegistrationForm', () => {
  describe('rendering', () => {
    it('renders email, password, confirm-password fields and submit button', () => {
      renderForm();
      expect(screen.getByTestId('register-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-confirm-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-submit-button')).toBeInTheDocument();
    });

    it('renders link to login page', () => {
      renderForm();
      expect(screen.getByTestId('register-to-login-link')).toBeInTheDocument();
    });

    it('shows server error when provided', () => {
      renderForm({ serverError: 'This email is already registered' });
      expect(screen.getByTestId('register-error')).toHaveTextContent(
        'This email is already registered'
      );
    });

    it('disables submit button and shows loading state', () => {
      renderForm({ isLoading: true });
      expect(screen.getByTestId('register-submit-button')).toBeDisabled();
      expect(screen.getByText(/Registering/i)).toBeInTheDocument();
    });
  });

  describe('validation — AC-3: password min length', () => {
    it('shows error when password is shorter than 8 characters', async () => {
      renderForm();
      await userEvent.type(screen.getByTestId('register-password-input'), 'short');
      fireEvent.blur(screen.getByTestId('register-password-input'));
      expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  describe('validation — AC-4: invalid email format', () => {
    it('shows error for invalid email', async () => {
      renderForm();
      await userEvent.type(screen.getByTestId('register-email-input'), 'invalid-email');
      fireEvent.blur(screen.getByTestId('register-email-input'));
      expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  describe('validation — AC-5: empty fields', () => {
    it('shows validation errors for all fields on submit when empty', async () => {
      renderForm();
      fireEvent.submit(screen.getByTestId('registration-form'));
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(await screen.findByText('Password is required')).toBeInTheDocument();
    });
  });

  describe('submission — AC-1: valid email and password', () => {
    it('calls onSubmit with email and password on valid input', async () => {
      const { onSubmit } = renderForm();
      await userEvent.type(screen.getByTestId('register-email-input'), 'user@example.com');
      await userEvent.type(screen.getByTestId('register-password-input'), 'Password123');
      await userEvent.type(screen.getByTestId('register-confirm-password-input'), 'Password123');
      fireEvent.submit(screen.getByTestId('registration-form'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('user@example.com', 'Password123');
      });
    });

    it('does not submit when passwords do not match', async () => {
      const { onSubmit } = renderForm();
      await userEvent.type(screen.getByTestId('register-email-input'), 'user@example.com');
      await userEvent.type(screen.getByTestId('register-password-input'), 'Password123');
      await userEvent.type(screen.getByTestId('register-confirm-password-input'), 'DifferentPass');
      fireEvent.submit(screen.getByTestId('registration-form'));

      expect(onSubmit).not.toHaveBeenCalled();
      expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  describe('password visibility toggle', () => {
    it('toggles password field between text and password type', async () => {
      renderForm();
      const passwordInput = screen.getByTestId('register-password-input');
      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(screen.getByTestId('register-password-visibility'));
      expect(passwordInput).toHaveAttribute('type', 'text');
      fireEvent.click(screen.getByTestId('register-password-visibility'));
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});
