import argon2 from 'argon2';

export async function hash(str: string) {
  return await argon2.hash(str, {
    type: argon2.argon2id,
    memoryCost: 16384,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function validate(hash: string, str: string) {
  try {
    return await argon2.verify(hash, str);
  } catch (err) {
    return false;
  }
}
