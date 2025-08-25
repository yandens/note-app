import { z } from 'zod';

import { Email, Password } from '$libs/db/schemas/common';
import { MongoObjectId } from '$libs/db/schemas/mongo';

export const UserSchema = MongoObjectId.extend({
  name: z.object({
    first: z.string().openapi({ example: 'John' }),
    last: z.string().openapi({ example: 'Smite' }),
  }),
  email: Email,
  password: Password,
});
export type User = z.infer<typeof UserSchema>;

export const RegisterRequestSchema = UserSchema.pick({
  email: true,
  password: true,
}).extend({
  confirmPassword: Password,
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = UserSchema.pick({
  email: true,
  password: true,
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  user: UserSchema.omit({
    password: true,
  }),
  token: z.string().openapi({ description: 'JWT Token' }),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const UpdateUserRequestSchema = UserSchema.pick({
  name: true,
  email: true,
}).partial();
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const UpdatePasswordRequestSchema = z.object({
  oldPassword: Password,
  newPassword: Password,
  confirmPassword: Password,
});
export type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequestSchema>;
