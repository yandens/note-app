import { db } from '$libs/db';
import type { Note } from '$libs/db/schemas';

export default db.collection<Note>('notes');
