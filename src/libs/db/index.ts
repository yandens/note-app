import { type Filter, MongoClient } from 'mongodb';

import { MONGODB_DATABASE, MONGODB_URL } from '$libs/config';

import logger from '../logger';

logger.info({
  msg: 'Connecting to MongoDB',
  url: MONGODB_URL.replace(/\/\/.*@/, '//***@'),
});
const client = new MongoClient(MONGODB_URL);

export const db = client.db(MONGODB_DATABASE, {
  ignoreUndefined: true,
});

export async function connectDatabase(): Promise<void> {
  await client.connect();
  logger.info({ msg: 'MongoDB connected' });
}

export async function disconnectDatabase(): Promise<void> {
  await client.close();
  logger.info({ msg: 'MongoDB disconnected' });
}

export function matchNotDeleted<T>(filter?: Filter<T>) {
  if (filter) {
    return {
      ...filter,
      deletedAt: { $exists: false },
    };
  }

  return {
    deletedAt: { $exists: false },
  };
}
