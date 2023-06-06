import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { UserEntity, UserSchema } from './users/abstractions/user.entity';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';

const SERVICES = [
  UsersService,
  AuthService
];

const REPOSITORIES = [
  UsersRepository
];

const STRATEGIES = [
  LocalStrategy,
  JwtStrategy,
  JwtRefreshStrategy
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ () => ({
        environment: process.env['NODE_ENV'] || 'development',
        port: parseInt(process.env['APP_PORT'] ?? '3333', 10),
        dbName: process.env['DB_NAME'],
        dbUri: process.env['DB_URI']
      }) ]
    }),

    MongooseModule.forRootAsync({
      useFactory: async (cfg: ConfigService) => ({
        dbName: cfg.get('dbName'),
        uri: cfg.get('dbUri')
        // useFindAndModify: false,
        // useCreateIndex: true
      }),

      inject: [ ConfigService ]
    }),

    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema }
    ]),

    PassportModule,
    JwtModule.register({})
  ],
  controllers: [
    AuthController
  ],
  providers: [
    ...STRATEGIES,
    ...REPOSITORIES,
    ...SERVICES
  ],
  exports: [
    AuthService
  ]
})
export class BackendCoreModule {
}
