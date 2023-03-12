import * as Joi from '@hapi/joi';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DatabaseModule} from '../database/database.module';
import {GlobalModule} from '../global/global.module';
import {GraphqlModule} from '../graphql/graphql.module';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from "../auth/auth.module";
import {AssetModule} from "../asset/asset.module";
import {RedisModule} from '@liaoliaots/nestjs-redis';
import {UserModule} from '../user/user.module';
import winston from "winston";
import {utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston';
import {TokenModule} from "../token/token.module";
import {WalletModule} from "../wallet/wallet.module";
import {HackathonAssetModule} from "../hackathon/hackathonAsset.module";


@Module({
  imports: [
    GlobalModule,
    GraphqlModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        QUERY_LOG_ENABLE: Joi.bool(),
        MAX_QUERY_RETRY: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_COOLDOWN_TIME: Joi.number().required(),
        REDIS_DAILY_LIMIT: Joi.number().required(),
        SNS_SYNC_ASSET_SINGLE_ARN: Joi.string().required(),
        SNS_SYNC_ASSET_DISPATCHER_ARN: Joi.string().required(),
        LOGGLY_SUBDOMAIN: Joi.string().required(),
        LOGGLY_TOKEN: Joi.string().required(),
        IS_MIGRATE_PASSWORD_ENCRYPT_RUNNING: Joi.bool(),
        ENCRYPT_PASSWORD_SECRET_KEY: Joi.string().required(),
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        readyLog: true,
        config: {
          url: `${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`
        },
      }),
    }),
    DatabaseModule,
    AuthModule,
    AssetModule,
    UserModule,
    TokenModule,
    WalletModule,
    HackathonAssetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
