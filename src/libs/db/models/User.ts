import { db } from '$libs/db';
import type { User } from '$libs/db/schemas';

const users = db.collection<User>('users');
await users.createIndex({ email: 1 });
export default users;
