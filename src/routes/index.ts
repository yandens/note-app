import { Router } from 'hyper-express';
import {
  createDocument,
  type ZodOpenApiObject,
  type ZodOpenApiParameters,
  type ZodOpenApiRequestBodyObject,
  type ZodOpenApiResponsesObject,
} from 'zod-openapi';

import { API_URL } from '$libs/config';
import note from '$routes/note';
import user from '$routes/user';

export const apiDocs: ZodOpenApiObject = {
  openapi: '3.1.0' as const,
  info: {
    title: 'Gencidev Note API',
    version: '1.0.0',
  },
  servers: [
    {
      url: API_URL,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'If status == 401 please get a new token with /auth/refresh, then retry the request',
      },
    },
  },
  paths: {},
};

const router = new Router();

router.use('/users', user);
router.use('/notes', note);

for (const r of router.routes) {
  const path = r.pattern.replace(/:(\w+)/g, '{$1}');

  apiDocs.paths ??= {};
  apiDocs.paths[path] ??= {};

  if (!('schema' in r.options)) continue;

  const schema = r.options.schema;
  const responses: ZodOpenApiResponsesObject = {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: schema.response,
        },
      },
    },
  };

  let requestBody: ZodOpenApiRequestBodyObject | undefined;
  if (schema.body !== undefined) {
    requestBody = {
      content: {
        'application/json': {
          schema: schema.body,
        },
      },
    };
  }

  const requestParams: ZodOpenApiParameters = {};

  if (schema.query !== undefined) {
    requestParams.query = schema.query;
  }

  if (schema.params !== undefined) {
    requestParams.path = schema.params;
  }

  apiDocs.paths[path] = {
    ...apiDocs.paths[path],
    [r.method === 'del' ? 'delete' : r.method]: {
      security: r.options.schema.permission ? [{ bearerAuth: [] }] : undefined,
      summary: r.options.description.summary,
      responses,
      requestBody,
      requestParams,
    },
  };
}

const document = createDocument(apiDocs);

router.get('/openapi', (req, res) => {
  return res.json(document);
});

export default router;
