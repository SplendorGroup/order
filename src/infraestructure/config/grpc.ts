import * as grpc from '@grpc/grpc-js';
import 'dotenv/config';

const caCert = Buffer.from(process.env.TLS_CA, 'utf8');
const clientCert = Buffer.from(
  process.env.TLS_CERT.replace(/\\n/g, '\n'),
  'utf8',
);
const clientKey = Buffer.from(
  process.env.TLS_KEY.replace(/\\n/g, '\n'),
  'utf8',
);

export const credentials = grpc.credentials.createSsl(caCert, clientKey, clientCert);