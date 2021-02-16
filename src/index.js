import 'source-map-support/register';
import { PORT } from './globals';
import app from './app';

async function start() {
  return app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.debug(`Server is ready and serving on port ${PORT}`);
  });
}

start();
