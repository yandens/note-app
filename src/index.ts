import HyperExpress from 'hyper-express';

import { PORT } from '$libs/config';
import { connectDatabase, disconnectDatabase } from '$libs/db';
import ApiError, { ValidationError } from '$libs/error';
import logger from '$libs/logger';
import router from '$routes';

import { apiDocsRouter } from './docs/openapi';

const server = new HyperExpress.Server();

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.options('*', (req, res) => {
  return res.status(204).send();
});

server.use(router);
server.use(apiDocsRouter);
server.set_error_handler((req, res, err) => {
  if (err instanceof ApiError) {
    if (err.statusCode === 500) {
      logger.error({ err, reqId: req.reqId }, 'error');
    }
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(422).json(err.issues);
  }

  logger.error({ err, reqId: req.reqId }, 'error');
  return res.status(500).send('internal_server_error');
});

let shuttingDown = false;
const shutdown = () => {
  if (shuttingDown) return;

  shuttingDown = true;
  logger.info({ msg: 'Shutting down...' });
  void server.shutdown().then(() => {
    logger.info({ msg: 'API stopped' });
  });
  void disconnectDatabase();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

try {
  await connectDatabase();
  await server.listen(PORT, '0.0.0.0').then(() => {
    logger.info({
      msg: 'API Started',
      port: PORT,
      url: `http://localhost:${PORT}`,
      documentation: `http://localhost:${PORT}/documentation`,
    });
  });
} catch (err) {
  process.exit(1);
}
