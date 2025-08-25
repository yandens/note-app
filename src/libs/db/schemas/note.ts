import { z } from 'zod';

import { Timestamp } from '$libs/db/schemas/common';
import {
  MongoObjectId,
  ObjectIdSchema,
  ObjectIdString,
} from '$libs/db/schemas/mongo';
import {
  Paginate,
  PaginationFilterSchema,
  SortFilterSchema,
} from '$libs/db/schemas/pagination';

export const NoteSchema = MongoObjectId.extend({
  userId: ObjectIdSchema,
  title: z.string(),
  description: z.string(),
}).merge(Timestamp);
export type Note = z.infer<typeof NoteSchema>;

export const NoteRequestSchema = NoteSchema.pick({
  title: true,
  description: true,
});
export type NoteRequest = z.infer<typeof NoteRequestSchema>;

export const NoteResponseSchema = NoteSchema.extend({
  user: z
    .object({
      _id: ObjectIdString,
      name: z.object({
        first: z.string().openapi({ example: 'John' }),
        last: z.string().openapi({ example: 'Smite' }),
      }),
      email: z.string().email(),
    })
    .optional(),
});
export type NoteResponse = z.infer<typeof NoteResponseSchema>;

export const PaginateNoteResponseSchema = Paginate(NoteResponseSchema);
export type PaginateNoteResponse = z.infer<typeof PaginateNoteResponseSchema>;

export const NoteFilterSchema = NoteSchema.pick({
  title: true,
})
  .extend({
    createdAtFrom: z.string(),
    createdAtUntil: z.string(),
    updatedAtFrom: z.string(),
    updatedAtUntil: z.string(),
  })
  .partial()
  .merge(PaginationFilterSchema)
  .merge(SortFilterSchema('updatedAt', 'createdAt'));
export type NoteFilter = z.infer<typeof NoteFilterSchema>;
