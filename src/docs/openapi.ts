import fs from 'fs/promises';
import handlebars from 'handlebars';
import { Router } from 'hyper-express';

export let apiWebDocs: HandlebarsTemplateDelegate | undefined;

export async function initApiDocs() {
  if (apiWebDocs !== undefined) return;

  const file = await fs.readFile('src/docs/openapi.hbs');
  apiWebDocs = handlebars.compile(file.toString());
}

export const apiDocsRouter = new Router();

apiDocsRouter.get('/documentation', async (req, res) => {
  await initApiDocs();
  return res.send(apiWebDocs!({ openApiUrl: '/openapi' }));
});
