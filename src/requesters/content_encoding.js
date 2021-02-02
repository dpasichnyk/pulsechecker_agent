import { brotliDecompress, gunzip, deflate } from 'zlib';

export async function genericDecode(bodyBuffer, decodeFunc) {
  return new Promise((resolve, reject) => {
    decodeFunc(bodyBuffer, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
}

export async function handleContentEncoding(bodyBuffer, contentEncoding = 'none') {
  let decodedBuffer = null;

  if (!bodyBuffer) {
    return { success: true, body: bodyBuffer };
  }

  switch (contentEncoding.toLowerCase()) {
    case 'br':
      decodedBuffer = await genericDecode(bodyBuffer, brotliDecompress);
      break;
    case 'gzip':
      decodedBuffer = await genericDecode(bodyBuffer, gunzip);
      break;
    case 'deflate':
      decodedBuffer = await genericDecode(bodyBuffer, deflate);
      break;
    case 'none':
      if (bodyBuffer.toString('UTF-8').substring(0, 2) === '\x1F\x8B') {
        decodedBuffer = await genericDecode(bodyBuffer, gunzip);
      } else {
        decodedBuffer = bodyBuffer;
      }
      break;
    default:
      return { success: false, error: `encoding-${contentEncoding}-not-supported` };
  }

  return { success: true, body: decodedBuffer };
}
