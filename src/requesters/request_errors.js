export const REQUEST_ERRORS = {
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
  CONTENT_ENCODING_FAILED: 'content-encoding-failed',
  COULDNT_CONNECT: 'couldnt-connect',
  RECV_FAILED: 'recv-failed',
};

const generateError = (type, opts) => ({ type, ...opts });

export function timeoutError() {
  return generateError(REQUEST_ERRORS.TIMEOUT);
}

export function contentEncodingFailedError(msg) {
  return generateError(REQUEST_ERRORS.CONTENT_ENCODING_FAILED, { msg });
}

export function couldntConnectError() {
  return generateError(REQUEST_ERRORS.COULDNT_CONNECT);
}

export function recvFailedError() {
  return generateError(REQUEST_ERRORS.RECV_FAILED);
}

export function unknownError(error, additionalString = '') {
  return generateError(
    REQUEST_ERRORS.UNKNOWN, { error: new Error(`Unknown Requester error: ${error}, (${additionalString})`) },
  );
}
