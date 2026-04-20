import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';

const router = Router();

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

const authService = new AuthService(new UserRepository());

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      errors: parsed.error.errors.map((e) => ({
        field: String(e.path[0] ?? 'unknown'),
        message: e.message,
      })),
    });
    return;
  }

  try {
    const result = await authService.register(parsed.data.email, parsed.data.password);
    res.status(201).json(result);
  } catch (err: unknown) {
    const typedErr = err as Error & { statusCode?: number };
    if (typedErr.statusCode === 409) {
      res.status(409).json({ error: typedErr.message });
      return;
    }
    next(err);
  }
});

export { router as authRouter };
