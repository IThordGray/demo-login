import { Global, Module } from '@nestjs/common';
import { AuthEmailService } from 'backend/core';
import { AuthEmailSendGridService } from './auth-email.send-grid.service';

@Global()
@Module({
  providers: [
    { provide: AuthEmailService, useValue: AuthEmailSendGridService }
  ],
  exports: [
    AuthEmailService
  ]
})
export class GlobalProvidersModule {

}
