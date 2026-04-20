import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { RegistrationForm } from '../features/auth/RegistrationForm';
import { registerUser, clearError } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';

export function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (email: string, password: string): Promise<void> => {
    dispatch(clearError());
    const result = await dispatch(registerUser({ email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign up to start organizing your projects with Tidy.
          </Typography>
          <RegistrationForm onSubmit={handleSubmit} isLoading={isLoading} serverError={error} />
        </CardContent>
      </Card>
    </Box>
  );
}
