import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().max(16),
  email: z.string().email().max(128),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export { registerSchema, loginSchema };
