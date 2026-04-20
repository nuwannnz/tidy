import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@tidy/shared-types';
import { UserRepository, UserRecord } from '../repositories/user.repository';
import { env } from '../utils/env';

const BCRYPT_COST = 12;

export interface RegisterResult {
  user: User;
  token: string;
}

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(email: string, password: string): Promise<RegisterResult> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered') as Error & { statusCode: number };
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const record = await this.userRepo.create(email, passwordHash);
    const user = toUserDto(record);
    const token = signToken(user.id);

    return { user, token };
  }
}

function toUserDto(record: UserRecord): User {
  return {
    id: record.id,
    email: record.email,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '7d' });
}
