import { ObjectId } from 'bson';
import { Router } from 'hyper-express';
import { z } from 'zod';

import {
  NoteFilterSchema,
  NoteRequestSchema,
  NoteResponseSchema,
  ObjectIdString,
  PaginateNoteResponseSchema,
} from '$libs/db/schemas';
import { ResponseSchema } from '$libs/db/schemas/common';
import ApiError from '$libs/error';
import { route } from '$routes/router';
import {
  createNote,
  deleteNote,
  getNote,
  getNoteById,
  getNotes,
  updateNote,
} from '$services/note';

const router = new Router();

route(
  router,
  'post',
  '/',
  {
    summary: 'Create Note',
  },
  {
    body: NoteRequestSchema,
    response: ResponseSchema(NoteResponseSchema),
    permission: true,
  },
  async (req, res) => {
    if (!req.user.id) throw new ApiError(401, 'unauthorized');

    const result = await createNote(req.user, req.data);
    if (!result) throw new ApiError(500, 'create_note_error');

    return res.json({ message: 'success', data: result });
  },
);

route(
  router,
  'get',
  '/',
  {
    summary: 'Get Notes',
  },
  {
    query: NoteFilterSchema,
    response: PaginateNoteResponseSchema,
    permission: true,
  },
  async (req, res) => {
    if (!req.user.id) throw new ApiError(401, 'unauthorized');

    const result = await getNotes(req.user, req.queries);
    return res.json(result);
  },
);

route(
  router,
  'get',
  '/:id',
  {
    summary: 'Get Note By ID',
  },
  {
    params: z.object({ id: ObjectIdString }),
    response: ResponseSchema(NoteResponseSchema),
    permission: true,
  },
  async (req, res) => {
    if (!req.user.id) throw new ApiError(401, 'unauthorized');

    const result = await getNoteById(req.params.id);
    if (!result) throw new ApiError(404, 'note_not_found');

    return res.json({ message: 'success', data: result });
  },
);

route(
  router,
  'patch',
  '/:id',
  {
    summary: 'Update Note',
  },
  {
    params: z.object({ id: ObjectIdString }),
    body: NoteRequestSchema.partial(),
    response: ResponseSchema(NoteResponseSchema),
    permission: true,
  },
  async (req, res) => {
    if (!req.user.id) throw new ApiError(401, 'unauthorized');

    const note = await getNote({
      userId: new ObjectId(req.user.id),
      _id: new ObjectId(req.params.id),
    });
    if (!note) throw new ApiError(404, 'note_not_found');

    const result = await updateNote(req.params.id, req.data);
    if (!result) throw new ApiError(500, 'updated_note_error');

    return res.json({ message: 'success', data: result });
  },
);

route(
  router,
  'delete',
  '/:id',
  {
    summary: 'Delete Note',
  },
  {
    params: z.object({ id: ObjectIdString }),
    response: ResponseSchema(),
    permission: true,
  },
  async (req, res) => {
    if (!req.user.id) throw new ApiError(401, 'unauthorized');

    const note = await getNote({
      userId: new ObjectId(req.user.id),
      _id: new ObjectId(req.params.id),
    });
    if (!note) throw new ApiError(404, 'note_not_found');

    const result = await deleteNote(req.params.id);
    if (!result) throw new ApiError(500, 'updated_note_error');

    return res.json({ message: 'success' });
  },
);

export default router;
