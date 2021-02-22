import { Router } from 'express';
import { check, header, validationResult } from 'express-validator';

import { Queue } from 'bullmq';

import apiAuthMiddleware from '../middleware/api_auth';

import { QUEUE_NAME, REDIS_HOST } from '../../globals';

const queue = new Queue(QUEUE_NAME, { connection: { host: REDIS_HOST } });

const router = Router();
router.post(
  '/',
  [
    apiAuthMiddleware,
    check('url').isURL(),
    check('userId').isInt(),
    check('interval').isInt(),
    check('kind').isString(),
    check('name').isString(),
    header('content-type').contains('application/json'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { body: { url, userId, interval, kind, name } } = req;

    const jobName = `${userId}-${kind}-${name}`;

    const { status, id, error } = await queue.add(jobName, { url, userId, kind, name }, { repeat: { every: interval } })
      .then(data => ({ status: 200, id: data.id }))
      .catch(exception => ({ status: 500, error: exception }));

    return res.json({ status, error, id });
  },
);

export default router;
