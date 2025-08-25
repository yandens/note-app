import {
  type DefaultRequestLocals,
  type MiddlewareHandler,
  type Request,
  type Response,
  Router,
} from 'hyper-express';
import type { AnyZodObject, z, ZodSchema } from 'zod';

import { validateBody, validateParams, validateQuery } from '$libs//validate';
import { validateResponse } from '$middlewares/prepare';
import { protect } from '$middlewares/protect';

export function route<
  ResType extends AnyZodObject,
  BodyType extends ZodSchema,
  QueryType extends AnyZodObject,
  ParamsType extends AnyZodObject,
>(
  router: Router,
  method:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'head'
    | 'options'
    | 'trace',
  path: string,
  description: {
    summary: string;
    description?: string;
  },
  schema: {
    response: ResType;
    body?: BodyType;
    query?: QueryType;
    params?: ParamsType;
    permission?: boolean;
  },
  handler: (
    req: Request<DefaultRequestLocals, z.infer<BodyType>, z.infer<QueryType>>,
    res: Response,
  ) => unknown,
) {
  const middlewares: MiddlewareHandler[] = [];
  middlewares.push(validateResponse(schema.response));

  if (schema.permission) {
    middlewares.push(protect());
  }

  if (schema.params !== undefined) {
    middlewares.push(validateParams(schema.params));
  }
  if (schema.query !== undefined) {
    middlewares.push(validateQuery(schema.query));
  }
  if (schema.body !== undefined) {
    middlewares.push(validateBody(schema.body));
  }

  router[method](path, { schema, description }, middlewares, handler);
}
