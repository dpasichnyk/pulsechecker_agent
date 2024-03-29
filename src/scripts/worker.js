import { Worker } from 'bullmq';
import metrics from '../lib/metrics';
import request from '../requester';
import { QUEUE_NAME, REDIS_HOST } from '../globals';

const worker = new Worker(QUEUE_NAME, async (job) => {
  const { verb, url, headers, body, options } = job.data;

  const requestOpts = {
    http2: options && options.http2,
    body: body && body.length > 0 && Buffer.from(body, 'base64').toString('ascii'),
  };

  return request(verb, url, headers, requestOpts)
    // eslint-disable-next-line no-unused-vars
    .then(({ _success, _meta, _status, _headers, _text, _error }) => {
      // Handle success, parse body etc.
    })
    // eslint-disable-next-line no-unused-vars
    .catch((_e) => {
      // Handle error
    });
}, { connection: { host: REDIS_HOST } });

worker.on('completed', (job) => {
  metrics.info('job_completion', { success: true, job });
  // eslint-disable-next-line no-console
  console.log(`Job ${job.name} completed.`);
});

worker.on('drained', () => {
  // eslint-disable-next-line no-console
  console.log('Jobs drained.');
});

worker.on('failed', (jobId, error) => {
  metrics.info('job_failure', { success: false, error });
  // eslint-disable-next-line no-console
  console.error(`myWorker :: ERROR; jobId = + ${jobId}`);
  // eslint-disable-next-line no-console
  console.error(error);
});
