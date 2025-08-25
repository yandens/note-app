import 'zod-openapi/extend';

import { ObjectId } from 'bson';
import { z } from 'zod';

export const ObjectIdSchema = z
  .custom<ObjectId | string>((val) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ((val as ObjectId)?._bsontype === 'ObjectId') return true;
    if (typeof val === 'string') return ObjectId.isValid(val);
    return false;
  })
  .transform((input, ctx) => {
    try {
      if (typeof input === 'string') return ObjectId.createFromHexString(input);
      else return input;
    } catch (error) {
      ctx.addIssue({
        message: error instanceof Error ? error.message : 'invalid_objectid',
        code: z.ZodIssueCode.custom,
        params: { input },
      });
      return z.NEVER;
    }
  })
  .openapi({
    description: 'MongoDB ObjectId',
    type: 'string',
  });
export type ObjectIdSchema = z.infer<typeof ObjectIdSchema>;

export const MongoObjectId = z.object({
  _id: ObjectIdSchema,
});

export const ObjectIdString = z
  .custom<ObjectId | string>((val) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ((val as ObjectId)?._bsontype === 'ObjectId') return true;
    if (typeof val === 'string') return ObjectId.isValid(val);
    return false;
  })
  .transform((input, ctx) => {
    if (typeof input === 'string') {
      if (!ObjectId.isValid(input)) {
        ctx.addIssue({
          message: 'invalid_objectid',
          code: z.ZodIssueCode.custom,
          params: { input },
        });
        return z.NEVER;
      }
      return input;
    }

    return input.toHexString();
  })
  .openapi({
    example: new ObjectId().toHexString(),
    type: 'string',
  });
export type ObjectIdString = z.infer<typeof ObjectIdString>;
