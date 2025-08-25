import { ObjectId } from 'bson';
import type { WithId } from 'mongodb';

import { matchNotDeleted } from '$libs/db';
import * as models from '$libs/db/models';
import type {
  RegisterRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  User,
} from '$libs/db/schemas';
import { hash } from '$libs/hash';
import type { Auth } from '$libs/helper';

export async function getUserByEmail(
  email: string,
): Promise<WithId<User> | null> {
  return await models.user.findOne(matchNotDeleted({ email }));
}

export async function getUserById(
  id: ObjectId | string,
): Promise<WithId<User> | null> {
  if (typeof id === 'string') id = new ObjectId(id);

  return await models.user.findOne(matchNotDeleted({ _id: id }));
}

export async function createUser(
  data: RegisterRequest,
): Promise<WithId<User> | null> {
  const { email, password } = data;

  const hashedPassword = await hash(password);
  const inserted = await models.user.insertOne({
    _id: new ObjectId(),
    email,
    password: hashedPassword,
    name: {
      first: '',
      last: '',
    },
  });
  if (!inserted.acknowledged) return null;

  return getUserById(inserted.insertedId);
}

export async function updateUserPassword(
  auth: Auth,
  data: UpdatePasswordRequest,
): Promise<WithId<User> | null> {
  const { newPassword } = data;

  const hashedPassword = await hash(newPassword);
  const updated = await models.user.updateOne(
    matchNotDeleted({ _id: new ObjectId(auth.id) }),
    {
      $set: {
        password: hashedPassword,
      },
    },
  );
  if (!updated.acknowledged) return null;

  return getUserById(auth.id);
}

export async function updateUser(
  auth: Auth,
  data: UpdateUserRequest,
): Promise<WithId<User> | null> {
  const updated = await models.user.updateOne(
    matchNotDeleted({ _id: new ObjectId(auth.id) }),
    {
      $set: {
        ...data,
      },
    },
  );
  if (!updated.acknowledged) return null;

  return getUserById(auth.id);
}
