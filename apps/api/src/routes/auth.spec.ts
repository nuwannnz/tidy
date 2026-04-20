import { app } from '../app';
import * as http from 'http';
import { AuthService } from '../services/auth.service';

jest.mock('../services/auth.service');
jest.mock('../repositories/user.repository');

function postJson(
  port: number,
  path: string,
  body: unknown
): Promise<{ status: number; json: unknown }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode ?? 0, json: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode ?? 0, json: null });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

describe('POST /api/v1/auth/register', () => {
  let server: http.Server;
  let port: number;

  beforeAll(() => {
    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        port = typeof address === 'object' && address ? address.port : 0;
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => server.close(() => resolve()));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 with user and token on valid registration', async () => {
    (AuthService.prototype.register as jest.Mock).mockResolvedValue({
      user: {
        id: 'abc',
        email: 'test@example.com',
        createdAt: '2026-04-17T00:00:00Z',
        updatedAt: '2026-04-17T00:00:00Z',
      },
      token: 'jwt.token.here',
    });

    const { status, json } = await postJson(port, '/api/v1/auth/register', {
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(status).toBe(201);
    expect(json).toMatchObject({ user: { email: 'test@example.com' }, token: 'jwt.token.here' });
  });

  it('returns 400 for invalid email', async () => {
    const { status, json } = await postJson(port, '/api/v1/auth/register', {
      email: 'not-an-email',
      password: 'Password123',
    });

    expect(status).toBe(400);
    expect((json as { errors: unknown[] }).errors).toBeDefined();
  });

  it('returns 400 for password shorter than 8 characters', async () => {
    const { status, json } = await postJson(port, '/api/v1/auth/register', {
      email: 'user@example.com',
      password: 'short',
    });

    expect(status).toBe(400);
    const errors = (json as { errors: { field: string; message: string }[] }).errors;
    expect(errors.some((e) => e.message === 'Password must be at least 8 characters')).toBe(true);
  });

  it('returns 400 for empty fields', async () => {
    const { status, json } = await postJson(port, '/api/v1/auth/register', {});

    expect(status).toBe(400);
    const errors = (json as { errors: { field: string }[] }).errors;
    expect(errors.some((e) => e.field === 'email')).toBe(true);
    expect(errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('returns 409 when email already exists', async () => {
    const conflict = new Error('Email already registered') as Error & { statusCode: number };
    conflict.statusCode = 409;
    (AuthService.prototype.register as jest.Mock).mockRejectedValue(conflict);

    const { status, json } = await postJson(port, '/api/v1/auth/register', {
      email: 'existing@example.com',
      password: 'Password123',
    });

    expect(status).toBe(409);
    expect((json as { error: string }).error).toBe('Email already registered');
  });
});
