import { Client } from '@elastic/elasticsearch';
import { METRIC_URL, METRIC_USERNAME, METRIC_PASSWORD } from '../globals';

const metrics = new Client({
  node: METRIC_URL,
  auth: { username: METRIC_USERNAME, password: METRIC_PASSWORD },
  ssl: { rejectUnauthorized: false },
});

export default metrics;
