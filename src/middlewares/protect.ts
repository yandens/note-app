import type { MiddlewareHandler } from 'hyper-express';
import type { AuthHeader } from 'types';

import { verify } from '$libs/jwt';

export function protect() {
  const middleware: MiddlewareHandler = async (req, res) => {
    if (!(req.headers as AuthHeader).authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    try {
      const data = await verify(req.headers.authorization.substring(7));

      req.user = {
        ...req.user,
        id: data.userId,
      };
    } catch (err) {
      console.log(req.headers.authorization);
      return res.status(401).json({ message: 'unauthorized' });
    }
  };

  return middleware;
}
