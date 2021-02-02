import { Curl, CurlHttpVersion, CurlProxy, CurlCode, CurlFeature, CurlInfoDebug } from 'node-libcurl';

import { handleContentEncoding } from './content_encoding';
import * as errors from './request_errors';

const INITIAL_TIMEOUT_MS = 15000;
const DEADLINE_TIMEOUT_MS = 30000;

const setHttpMethod = (curl, method = 'GET') => {
  switch (method.toLowerCase()) {
    case 'get':
      return curl.setOpt(Curl.option.HTTPGET);
    case 'patch':
      return curl.setOpt(Curl.option.CUSTOMREQUEST, 'PATCH');
    case 'post':
      return curl.setOpt(Curl.option.POST, 1);
    case 'put':
      return curl.setOpt(Curl.option.CUSTOMREQUEST, 'PUT');
    default:
      throw new Error(`Unknown request method: ${method}`);
  }
};

const mapErrors = (error, errorCode, additionalInfo = '') => {
  switch (errorCode) {
    case CurlCode.CURLE_OPERATION_TIMEDOUT:
      return errors.timeoutError();
    case CurlCode.CURLE_COULDNT_CONNECT:
      return errors.couldntConnectError();
    case CurlCode.CURLE_RECV_ERROR:
      return errors.recvFailedError();
    case CurlCode.CURLE_COULDNT_RESOLVE_PROXY:
      return errors.couldntConnectError();
    default:
      return errors.unknownError(error, `Error code: ${errorCode}, ${additionalInfo}`);
  }
};

const libCurlRequest = (
  method, url, requestHeaders = {}, proxy = undefined,
  requestBody = undefined, http2 = false, opts = {},
  followRedirect = false, insecureRequest = false,
) => {
  const curl = new Curl();
  const { option: opt } = Curl;
  const { V1_1, v3 } = CurlHttpVersion;

  curl.enable(CurlFeature.NoDataParsing);
  setHttpMethod(curl, method);
  curl.setOpt(opt.URL, url);
  curl.setOpt(opt.SSL_VERIFYPEER, 0);
  curl.setOpt(opt.HTTPHEADER, Object.keys(requestHeaders).map(headerKey => `${headerKey}: ${requestHeaders[headerKey]}`));
  curl.setOpt(opt.HTTP_VERSION, http2 ? v3 : V1_1);

  curl.setOpt(opt.CONNECTTIMEOUT_MS, opts.initialTimeoutMs || INITIAL_TIMEOUT_MS);
  curl.setOpt(opt.TIMEOUT_MS, opts.deadlineTimeoutMs || DEADLINE_TIMEOUT_MS);
  curl.setOpt(opt.VERBOSE, true);

  let curlDebug = '';

  curl.setOpt(opt.DEBUGFUNCTION, (type, b) => {
    let text = '';
    switch (CurlInfoDebug[type]) {
      case 'Text':
        curlDebug += `${b.toString()}`;
      /* FALLTHROUGH */
      default: /* in case a new one is introduced to shock us */
        return 0;
      case 'HeaderOut':
        text += `${b}`;
        break;
      case 'DataOut':
        text += `${b}`;
        break;
      case 'SslDataOut':
        text += `${b}`;
        break;
      case 'HeaderIn':
        text += `${b}`;
        break;
      case 'DataIn':
        break;
      case 'SslDataIn':
        break;
    }

    curlDebug += text;

    return 0;
  });

  if (http2) {
    curl.setOpt(opt.IGNORE_CONTENT_LENGTH, true);
  }

  if (followRedirect) {
    curl.setOpt(opt.FOLLOWLOCATION, true);
  }

  if (insecureRequest) {
    curl.setOpt(opt.SSL_VERIFYHOST, 0);
    curl.setOpt(opt.SSL_VERIFYPEER, 0);
  }

  if (requestBody) {
    curl.setOpt(opt.POSTFIELDS, requestBody);
  }

  if (proxy) {
    curl.setOpt(opt.PROXY, `${proxy.host}:${proxy.port}`);
    curl.setOpt(opt.PROXYTYPE, CurlProxy.Http);
    curl.setOpt(opt.PROXYUSERNAME, proxy.user);
    curl.setOpt(opt.PROXYPASSWORD, proxy.password);
    curl.setOpt(opt.PROXYHEADER, [
      'Proxy-Connection: Keep-Alive',
      'Connection: Keep-Alive',
    ]);
  }

  return new Promise((resolve, reject) => {
    curl.on('end', async (status, body, allHeaders, handle) => {
      const sizeDownload = handle.getInfo('SIZE_DOWNLOAD_T');
      const requestSize = handle.getInfo('REQUEST_SIZE');

      curl.close();

      const proxyHeaders = {};
      const headers = {};

      const contentEncoding = headers && (
        headers['content-encoding'] || headers['Content-Encoding']
      );

      const { success: decodeSuccess, body: decodeBody, error: decodeError } = await handleContentEncoding(body, contentEncoding);

      if (!decodeSuccess) {
        return reject(errors.contentEncodingFailedError(decodeError));
      }

      return resolve({ status, body: decodeBody, headers, proxyHeaders, requestMeta: { sizeDownload, requestSize } });
    });

    curl.on('error', (error, errorCode) => {
      curl.close();
      const additionalInfo = `Method: ${method}, requested URL: ${url}, http2: ${http2}, proxy: ${proxy}, \n verbose: ${curlDebug}`;
      return reject(mapErrors(error, errorCode, additionalInfo));
    });

    curl.perform();
  });
};

export default libCurlRequest;
