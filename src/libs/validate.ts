import type {
  DefaultRequestLocals,
  MiddlewareHandler,
  Request,
} from 'hyper-express';
import type { AnyZodObject, z, ZodSchema } from 'zod';

export function validateBody<K extends ZodSchema>(
  schema: K,
): MiddlewareHandler {
  return async (req: Request<DefaultRequestLocals, z.infer<K>>, res) => {
    const contentType = req.header('content-type') || '';
    if (contentType.startsWith('multipart/form-data')) return;
    if (contentType !== 'application/json') {
      return res.status(422).json({ message: 'invalid_content_type' });
    }

    const body = await req.json<unknown, undefined>(undefined);
    const result = schema.safeParse(body);
    if (!result.success) {
      return res.status(422).json(result.error.issues);
    }

    req.data = result.data;
  };
}

export function validateQuery<K extends AnyZodObject>(
  schema: K,
): MiddlewareHandler {
  return (
    req: Request<DefaultRequestLocals, unknown, z.infer<K>>,
    res,
    next,
  ) => {
    const queryStrings = req.query_parameters;
    const result = schema.safeParse(queryStrings);
    if (!result.success) {
      return res.status(422).json(result.error.issues);
    }

    req.queries = result.data;
    next();
  };
}

export function validateParams<K extends AnyZodObject>(
  schema: K,
): MiddlewareHandler {
  return (
    req: Request<DefaultRequestLocals, unknown, unknown, z.infer<K>>,
    res,
    next,
  ) => {
    const params = req.params;
    const result = schema.safeParse(params);
    if (!result.success) {
      return res.status(422).json(result.error.issues);
    }

    req.urlParams = result.data;
    next();
  };
}
