import { ClientOptions, Transport } from "@nestjs/microservices";
import { credentials } from '@/infraestructure/config/grpc';
import 'dotenv/config';
import { resolve } from "path";
import { SendMassRequest, SendMassResponse, SendSingleRequest, SendSingleResponse } from "@/domain/types/mail";

export const mailGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'mail',
    protoPath: resolve('src/infraestructure/protos/mail.proto'),
    url: process.env.GRPC_MAIL_URL,
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

export interface MailGrpcClientMethods {
  SendSingle(data: SendSingleRequest): Promise<SendSingleResponse>;
  SendMass(data: SendMassRequest): Promise<SendMassResponse>;
}