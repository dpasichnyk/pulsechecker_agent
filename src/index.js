import 'source-map-support/register';
import { promisify } from 'util';
import { PORT, HOST_NAME, REDIS_URL } from './globals';
import app from './app';

import Redis from "ioredis";
const redis = new Redis("redis://redis:6379");

import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('foo', { connection: {
    host: REDIS_URL,
    port: 6379
  }});

function addJobs(){
  myQueue.add('myJobName', { foo: 'bar' });
  myQueue.add('myJobName', { qux: 'baz' });
}

addJobs();

const worker = new Worker(myQueue, async job => {
  // Will print { foo: 'bar'} for the first job
  // and { qux: 'baz' } for the second.
  console.log(job.data);
});

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});


async function start() {
  return app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.debug(`Server is ready and serving on port ${PORT}`);
  });
}

start();
