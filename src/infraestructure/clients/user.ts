import { ClientOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import {
  FindAllRequest,
  FindAllResponse,
  FindOneRequest,
  FindOneResponse,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  DeleteResponse,
  SyncRoleWithUserRequest,
  SyncRoleWithUserResponse,
  Entity,
} from './types/user';
import { credentials } from '../config/grpc';
import 'dotenv/config';
import { Observable } from 'rxjs';

export const userGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: resolve('src/infraestructure/protos/user.proto'),
    url: process.env.GRPC_USER_URL,
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

export interface UserGrpcClientMethods {
  FindAll(data: FindAllRequest): Observable<FindAllResponse>;
  FindOne(data: FindOneRequest): Observable<FindOneResponse>;
  Create(data: CreateRequest): Observable<Entity>;
  Update(data: UpdateRequest): Observable<Entity>;
  Delete(data: DeleteRequest): Observable<DeleteResponse>;
  SyncRoleWithUser(
    data: SyncRoleWithUserRequest,
  ): Observable<SyncRoleWithUserResponse>;
}

export type UserMethodsName = keyof UserGrpcClientMethods;
