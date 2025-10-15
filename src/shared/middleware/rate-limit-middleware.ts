import { NextFunction, Request, Response } from 'express';
import { rateLimitsCollections } from '../../setup/setup-mongo-db';
import { HttpStatuses } from '../enums/http-statuses';
import { createError } from '../utils/create-error';
import { getClientIp } from '../utils/get-client-ip';
const REQUEST_LIMIT = 5;
const TIME_WINDOW_SEC = 10;

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const url = req.url;
  const now = new Date();
  const windowStart = new Date(now.getTime() - TIME_WINDOW_SEC * 1000);

  try {
    await rateLimitsCollections.deleteMany({
      ip,
      url,
      date: { $lt: windowStart },
    });

    const recentRequests = await rateLimitsCollections.countDocuments({
      ip,
      url,
      date: { $gte: windowStart },
    });

    if (recentRequests >= REQUEST_LIMIT) {
      res.status(HttpStatuses.TooManyAttempts).send(
        createError([
          {
            field: '',
            message: 'Too many requests. Please try again later.',
          },
        ]),
      );
      return;
    }

    await rateLimitsCollections.insertOne({ ip, url, date: now });

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next();
  }
};
