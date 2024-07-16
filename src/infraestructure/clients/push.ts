import { ClientOptions, Transport } from '@nestjs/microservices';
import { credentials } from '../config/grpc';
import 'dotenv/config';
import { resolve } from 'path';
import { SendPushRequest, SendPushResponse } from '@/domain/types/push';

export const pushGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'push',
    protoPath: resolve('src/infraestructure/protos/push.proto'),
    url: process.env.GRPC_PUSH_URL,
    gracefulShutdown: true,
    credentials,
    loader: {
      keepCase: true,
      defaults: true,
      json: true,
      arrays: true,
    },
  },
};

export interface PushGrpcClientMethods {
  SendPush(data: SendPushRequest): Promise<SendPushResponse>;
}
