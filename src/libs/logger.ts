import pino from 'pino';

const redact = [
  'res.paths',
  'req.password',
  'req.confirm',
  'res.token',
  'res.refreshToken',
];

export default pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
    },
  },
  redact,
});
