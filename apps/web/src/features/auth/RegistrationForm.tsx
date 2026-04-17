import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
  Link,
} from '@mui/material';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegistrationFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  serverError?: string | null;
}

function validateEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
}

function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) {
    return 'Please confirm your password';
  }
  if (password !== confirm) {
    return 'Passwords do not match';
  }
  return undefined;
}

export function RegistrationForm({
  onSubmit,
  isLoading = false,
  serverError,
}: RegistrationFormProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => ({
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });

  const handleBlur = (field: keyof typeof touched): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const allTouched = { email: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }
    onSubmit(email.trim(), password);
  };

  const fieldError = (field: keyof FormErrors): string | undefined =>
    touched[field] ? errors[field] : undefined;

  return (
    <Box
      component="form"
      data-testid="registration-form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {serverError && (
        <Typography color="error" variant="body2" data-testid="register-error" role="alert">
          {serverError}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur('email')}
        error={Boolean(fieldError('email'))}
        helperText={fieldError('email')}
        inputProps={{ 'data-testid': 'register-email-input' }}
        required
        fullWidth
        autoComplete="email"
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur('password')}
        error={Boolean(fieldError('password'))}
        helperText={fieldError('password')}
        inputProps={{ 'data-testid': 'register-password-input' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                data-testid="register-password-visibility"
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                size="small"
              >
                {showPassword ? 'Hide' : 'Show'}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        fullWidth
        autoComplete="new-password"
      />

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        error={Boolean(fieldError('confirmPassword'))}
        helperText={fieldError('confirmPassword')}
        inputProps={{ 'data-testid': 'register-confirm-password-input' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword((v) => !v)}
                edge="end"
                size="small"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        fullWidth
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        data-testid="register-submit-button"
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>

      <Box textAlign="center">
        <Link href="/login" data-testid="register-to-login-link" underline="hover">
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
}
