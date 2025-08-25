import { z } from 'zod';

export const Timestamp = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const CommonOmit = {
  _id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export const Email = z
  .string()
  .email('invalid_email')
  .openapi({ example: 'admin@gancidev.com' });
export type Email = z.infer<typeof Email>;

export const Password = z
  .string()
  .min(8, 'minimum_8_characters')
  .openapi({ example: 'Asdqwe123@' });
export type Password = z.infer<typeof Password>;

export const ResponseSchema = <T extends z.ZodTypeAny>(schema?: T) =>
  z.object({
    data: schema ?? z.undefined(),
    message: z.string(),
  });
