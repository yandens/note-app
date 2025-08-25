import type { MiddlewareHandler, Request, Response } from 'hyper-express';
import hyperid from 'hyperid';
import { type AnyZodObject, z } from 'zod';

import logger from '$libs/logger';

const hyperidInstance = hyperid({ urlSafe: true });

export function validateResponse<K extends AnyZodObject>(
  schema: K,
): MiddlewareHandler {
  return (req: Request, res: Response<z.infer<K>>, next) => {
    const userAgent = req.header('User-Agent');
    const reqId = hyperidInstance();
    const path = req.route.pattern;

    req.reqId = reqId;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const _json = res.json;
    let resBody: unknown = null;
    res.json = (data) => {
      resBody = data;
      if ((res.statusCode ?? 200) >= 300) return _json.call(res, data);

      const result = schema.safeParse(data);
      if (!result.success) {
        logger.error({
          msg: 'response_validation_error',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          res: data,
          reqId,
        });
        res.status(500);
        resBody = result.error.issues;
      } else {
        resBody = result.data;
      }
      return _json.call(res, resBody);
    };

    const startTime = process.hrtime();
    const ip = req.ip;
    res.header('Request-Id', reqId);

    res.on('prepare', () => {
      const endTime = process.hrtime(startTime);
      const duration = endTime[0] * 1000 + endTime[1] / 1000000;
      res.header('X-Response-Time', duration.toString());

      logger.info({
        msg: 'Request',
        reqId,
        method: req.method,
        status: res.statusCode ?? 200,
        url: req.url,
        ip,
        duration,
        path,
        req: req.data,
        res: resBody,
        ua: userAgent,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        userId: req?.user?.id,
      });
    });

    next();
  };
}
