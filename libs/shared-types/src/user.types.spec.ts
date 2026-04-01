import { User, CreateUserDto, LoginDto, AuthResponse } from './user.types';

describe('User Types', () => {
  it('should define User interface structure', () => {
    const user: User = {
      id: 'user-1',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(user.id).toBe('user-1');
    expect(user.email).toBe('test@example.com');
  });

  it('should define CreateUserDto structure', () => {
    const createDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'securepassword123',
    };

    expect(createDto.email).toBe('newuser@example.com');
    expect(createDto.password).toBe('securepassword123');
  });

  it('should define LoginDto structure', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(loginDto.email).toBe('test@example.com');
  });

  it('should define AuthResponse structure', () => {
    const authResponse: AuthResponse = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'jwt-token-here',
      refreshToken: 'refresh-token-here',
    };

    expect(authResponse.user.id).toBe('user-1');
    expect(authResponse.token).toBe('jwt-token-here');
  });
});
