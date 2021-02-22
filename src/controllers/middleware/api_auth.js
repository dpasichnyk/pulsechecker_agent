import authenticate from '../../lib/api_auth';

export default async function (req, res, next) {
  const { api_key: apiKey } = req.headers;

  const user = await authenticate(apiKey);

  if (!user) {
    return res.status(401).send('Not authorized!');
  }

  req.user = user;

  return next();
}
