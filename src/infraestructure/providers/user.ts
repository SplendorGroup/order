import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserGrpcClientMethods, UserMethodsName, userGrpcClientOptions } from '@/infraestructure/clients/user';

@Injectable()
export class UserGrpcProvider implements OnModuleInit {
  @Client(userGrpcClientOptions)
  private userClient: ClientGrpc;
  private userService: UserGrpcClientMethods;

  onModuleInit() {
    this.userService = this.userClient.getService('UserService');
  }

  async proxyUser(method:  UserMethodsName, data: any) {
    return await lastValueFrom(this.userService[method](data));
  }
}
