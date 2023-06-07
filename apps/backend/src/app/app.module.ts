import { Module } from '@nestjs/common';
import { BackendCoreModule } from 'backend/core';
import { GlobalProvidersModule } from './global-providers.module';

@Module({
  imports: [
    GlobalProvidersModule,
    BackendCoreModule
  ]
})
export class AppModule {}
