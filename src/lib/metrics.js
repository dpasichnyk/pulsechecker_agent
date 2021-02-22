import { Client } from '@elastic/elasticsearch';
import { METRIC_URL, METRIC_USERNAME, METRIC_PASSWORD, SUBPROJECT_NAME } from '../globals';

class Metrics {
  constructor(index) {
    this.client = new Client({
      node: METRIC_URL,
      auth: { username: METRIC_USERNAME, password: METRIC_PASSWORD },
      ssl: { rejectUnauthorized: false },
    });

    this.index = index;
  }

  defaultAttributes() {
    return { '@timestamp': new Date().toISOString() };
  }

  info(name, body) {
    const metricData = { index: this.index, body: { '@type': 'info', '@name': name, ...this.defaultAttributes(), ...body } };
    this.client.index(metricData)
      // eslint-disable-next-line no-console
      .then(() => console.log(JSON.stringify(metricData)))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.debug(`Error during saving to elasticsearch, original exception: ${error}`);
      });
  }

  error(name, body) {
    const metricData = { index: this.index, body: { '@type': 'error', '@name': name, ...this.defaultAttributes(), ...body } };

    this.client.index(metricData)
      // eslint-disable-next-line no-console
      .then(() => console.log(JSON.stringify(metricData)))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.debug(`Error during saving to elasticsearch, original exception: ${error}`);
      });
  }
}

export default new Metrics(SUBPROJECT_NAME);
