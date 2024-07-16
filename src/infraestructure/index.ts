import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { MongodbConnection } from './connections/mongodb';
import { Repository } from './repositories/repository';
import { models } from './config/models';
import { NotificationProvider } from './providers/notification';
import { UserGrpcProvider } from './providers/user';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    MongodbConnection,
    PrismaClient,
    ...models.map(entity => ({
      provide: entity,
      useFactory: (prisma: PrismaClient) => new Repository(prisma, entity),
      inject: [PrismaClient],
    })),
    {
      provide: 'NOTIFICATION',
      useClass: NotificationProvider,
    },
    {
      provide: 'USER',
      useClass: UserGrpcProvider
    }
  ],
  exports: [
    MongodbConnection,
    PrismaClient,
    ...models.map(entity => ({
      provide: entity,
      useFactory: (prisma: PrismaClient) => new Repository(prisma, entity),
      inject: [PrismaClient],
    })),
    {
      provide: 'NOTIFICATION',
      useClass: NotificationProvider,
    },
    {
      provide: 'USER',
      useClass: UserGrpcProvider
    }
  ],
})
export class Infraestructure {}
