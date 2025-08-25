import * as process from 'node:process';

export const PORT = Number(process.env.PORT ?? 3030);

export const MONGODB_URL =
  process.env.MONGODB_URL ??
  'mongodb://127.0.0.1:27017/gencidev?replicaSet=rs0';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? 'gencidev';

export const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION ?? 1; // HOUR
export const JWT_SECRET = process.env.JWT_SECRET ?? 'gencidev-test';

export const API_URL = process.env.API_URL ?? 'http://localhost:3030';
