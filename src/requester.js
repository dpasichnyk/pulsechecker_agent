import { libCurlRequest } from './requesters';
import { REQUEST_ERRORS } from './requesters/request_errors';

// eslint-disable-next-line no-unused-vars
export default async function request(verb, url, reqHeaders = {}, opts) {
  const timing = {
    start: new Date(),
    time: 0,
  };

  return libCurlRequest(
    verb,
    url,
    {},
    {},
    opts.body,
    true,
    {},
    false,
  )
    // eslint-disable-next-line no-unused-vars
    .then(async ({ status, body, headers: respHeaders, requestMeta }) => {
      timing.time = new Date() - timing.start;

      let detectedError;

      return {
        success: !detectedError,
        status,
        headers: respHeaders,
        text: body,
        error: detectedError,
      };
    })
    .catch(({ type, ...errorOpts }) => {
      timing.time = new Date() - timing.start;

      // We have an unhandled and unknown error, we don't know what to do, throw
      if (type === REQUEST_ERRORS.UNKNOWN) {
        throw errorOpts.error;
      }

      return {
        success: false,
        status: 500,
        headers: {},
        text: undefined,
        error: 'some error',
        sessionData: undefined,
      };
    });
}
