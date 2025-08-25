/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type AnyZodObject, ZodSchema } from 'zod';

declare module 'hyper-express' {
  interface UserRouteOptions {
    schema: {
      response: AnyZodObject;
      body?: ZodSchema;
      query?: AnyZodObject;
      params?: AnyZodObject;
      permission?: boolean;
    };
    description: {
      summary: string;
      description?: string;
    };
  }

  interface Schema {
    Body: AnyZodObject;
    Query: AnyZodObject;
    Params: AnyZodObject;
  }

  interface Request<
    Body = ZodSchema,
    Query = AnyZodObject,
    Params = AnyZodObject,
  > {
    data: Body;
    queries: Query;
    urlParams: Params;
    user: {
      id: string;
    };
    route: {
      pattern: string;
    };
    reqId: string;
  }
}
