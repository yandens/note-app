import 'zod-openapi/extend';

import { z } from 'zod';

export const PaginationMetadataSchema = z
  .object({
    page: z
      .number()
      .int()
      .positive()
      .default(1)
      .openapi({ description: 'Current page', example: 1 }),
    limit: z
      .number()
      .int()
      .positive()
      .default(1)
      .openapi({ description: 'Items per page', example: 20 }),
    total: z
      .number()
      .int()
      .positive()
      .default(1)
      .openapi({ description: 'Total page', example: 1 }),
    count: z
      .number()
      .int()
      .min(0)
      .default(0)
      .openapi({ description: 'Total items count', example: 100 }),
  })
  .openapi({
    description: 'Pagination Metadata',
    ref: 'PaginationMetadata',
  });
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;

export const PaginationSchema = z.object({
  pagination: PaginationMetadataSchema,
});

export const Paginate = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    data: z.array(schema),
    pagination: PaginationMetadataSchema,
  });
};
export type Paginate<T> = {
  data: T[];
  pagination: PaginationMetadata;
};

export const PaginationFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(20),
});
export type PaginationFilter = z.infer<typeof PaginationFilterSchema>;

export const SortFilterSchema = <const T extends [string, ...string[]]>(
  ...fields: T
) =>
  z.object({
    sortBy: z.enum(fields).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
  });
