import jwt from 'jsonwebtoken';
import type { JWTPayload } from 'types';

import { JWT_SECRET } from './config';

export async function sign(
  payload: object,
  options: jwt.SignOptions = { expiresIn: '365d' },
): Promise<string> {
  return await new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (err, token) => {
      if (err === null) return resolve(token!);
      reject(err);
    });
  });
}

export async function verify(token: string): Promise<JWTPayload> {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err === null) return resolve(decoded as JWTPayload);
      reject(err);
    });
  });
}
