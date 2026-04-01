export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

// Validation rules for CreateUserDto:
// - email: valid email format (RFC 5322)
// - password: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number

export interface LoginDto {
  email: string;
  password: string;
}

// Validation rules for LoginDto:
// - email: valid email format (RFC 5322)
// - password: non-empty string

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
