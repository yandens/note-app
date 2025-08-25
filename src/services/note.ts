import { type Document, ObjectId } from 'bson';
import type { Filter, WithId } from 'mongodb';

import { matchNotDeleted } from '$libs/db';
import * as models from '$libs/db/models';
import type {
  Note,
  NoteFilter,
  NoteRequest,
  PaginateNoteResponse,
} from '$libs/db/schemas';
import { dateBetween, sort, text } from '$libs/filter';
import type { Auth } from '$libs/helper';
import { paginate } from '$libs/pagination';

export async function createNote(
  auth: Auth,
  data: NoteRequest,
): Promise<WithId<Note> | null> {
  const inserted = await models.note.insertOne({
    _id: new ObjectId(),
    userId: new ObjectId(auth.id),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return getNoteById(inserted.insertedId);
}

export async function getNoteById(
  id: string | ObjectId,
): Promise<WithId<Note> | null> {
  if (typeof id === 'string') id = new ObjectId(id);
  return await models.note.findOne(matchNotDeleted({ _id: id }));
}

export async function getNote(
  filter: Filter<Note>,
): Promise<WithId<Note> | null> {
  return await models.note.findOne(matchNotDeleted(filter));
}

export async function getNotes(
  auth: Auth,
  filter: NoteFilter,
): Promise<PaginateNoteResponse> {
  const query: Filter<Note> = {
    userId: new ObjectId(auth.id),
  };
  text(query, 'title', filter.title);
  dateBetween(query, 'createdAt', filter.createdAtFrom, filter.createdAtUntil);
  dateBetween(query, 'updatedAt', filter.updatedAtFrom, filter.updatedAtUntil);

  const pipeline: Document[] = [
    {
      $match: matchNotDeleted(query),
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: '$user',
    },
  ];
  sort(pipeline, filter);

  return await paginate(models.note, pipeline, filter);
}

export async function updateNote(
  id: string | ObjectId,
  data: Partial<NoteRequest>,
): Promise<WithId<Note> | null> {
  if (typeof id === 'string') id = new ObjectId(id);

  const updated = await models.note.updateOne(matchNotDeleted({ _id: id }), {
    $set: data,
  });
  if (!updated.acknowledged) return null;

  return getNoteById(id);
}

export async function deleteNote(id: string | ObjectId): Promise<boolean> {
  if (typeof id === 'string') id = new ObjectId(id);

  const deleted = await models.note.updateOne(matchNotDeleted({ _id: id }), {
    $set: {
      deletedAt: new Date(),
    },
  });

  return deleted.acknowledged;
}
