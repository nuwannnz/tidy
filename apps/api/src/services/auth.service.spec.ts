import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../repositories/user.repository');

const mockBcrypt = jest.mocked(bcrypt);
const mockJwt = jest.mocked(jwt);

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService(mockUserRepo);
  });

  describe('register', () => {
    const email = 'test@example.com';
    const password = 'Password123';
    const passwordHash = '$2b$12$hashedpassword';
    const fakeRecord = {
      PK: 'USER#abc-123',
      SK: 'PROFILE',
      GSI1PK: 'EMAIL#test@example.com',
      GSI1SK: 'PROFILE',
      entityType: 'USER',
      id: 'abc-123',
      email: 'test@example.com',
      passwordHash,
      createdAt: '2026-04-17T00:00:00.000Z',
      updatedAt: '2026-04-17T00:00:00.000Z',
    };

    it('returns user and token on successful registration', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(fakeRecord);
      mockBcrypt.hash.mockResolvedValue(passwordHash as never);
      mockJwt.sign.mockReturnValue('fake.jwt.token' as never);

      const result = await authService.register(email, password);

      expect(result.user).toEqual({
        id: 'abc-123',
        email: 'test@example.com',
        createdAt: fakeRecord.createdAt,
        updatedAt: fakeRecord.updatedAt,
      });
      expect(result.token).toBe('fake.jwt.token');
    });

    it('hashes password with bcrypt cost factor 12', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(fakeRecord);
      mockBcrypt.hash.mockResolvedValue(passwordHash as never);
      mockJwt.sign.mockReturnValue('token' as never);

      await authService.register(email, password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 12);
    });

    it('throws 409 when email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(fakeRecord);

      await expect(authService.register(email, password)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });
    });

    it('never stores plain-text password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(fakeRecord);
      mockBcrypt.hash.mockResolvedValue(passwordHash as never);
      mockJwt.sign.mockReturnValue('token' as never);

      await authService.register(email, password);

      const [calledEmail, calledHash] = mockUserRepo.create.mock.calls[0];
      expect(calledEmail).toBe(email);
      expect(calledHash).not.toBe(password);
      expect(calledHash).toBe(passwordHash);
    });

    it('generates JWT with user id as subject', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(fakeRecord);
      mockBcrypt.hash.mockResolvedValue(passwordHash as never);
      mockJwt.sign.mockReturnValue('token' as never);

      await authService.register(email, password);

      expect(mockJwt.sign).toHaveBeenCalledWith(
        { sub: 'abc-123' },
        expect.any(String),
        expect.objectContaining({ expiresIn: '7d' })
      );
    });
  });
});
