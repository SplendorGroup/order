import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Domain } from './domain';
import { Application } from './application';
import { Infraestructure } from './infraestructure';
import { Presentation } from './presentation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Infraestructure,
    Domain,
    Application,
    Presentation,
  ],
})
export class App {}
