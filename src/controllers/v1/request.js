import { Router } from 'express';
import { check, header, validationResult } from 'express-validator';
import request from './../../requester';

const router = Router();
router.post(
  '/',
  [
    check('url').isURL(),
    check('sessionData').isString().optional(),
    check('body').optional({ nullable: true }),
    header('content-type').contains('application/json'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { body } = req;

    const requestOpts = {
      sessionData: body.sessionData,
      http2: body.options && body.options.http2,
      country: body.options && body.options.country,
      countryCode: body.options && body.options.country_code,
      body: body.body && body.body.length > 0 && Buffer.from(body.body, 'base64').toString('ascii'),
    };

    const format = body.format || 'base64';
    const verb = (body.method || body.verb);

    return request(verb, body.url, body.headers, requestOpts)
      .then(({ success, meta, status, headers, text, error, sessionData: newSessionData }) => {
        const byteBody = text ? text.toString(format) : '';

        return res.json({
          success,
          status_code: status,
          headers: headers || {},
          byte_body: byteBody,
          meta,
          error,
          sessionData: newSessionData,
        });
      })
      .catch((e) => {
        handleError(e);

        return res.json({
          success: false,
          status_code: 500,
          headers: {},
          byte_body: '',
          error: e.message,
        });
      });
  },
);

export default router;
