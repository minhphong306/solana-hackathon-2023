import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import Users from '../auth/entities/user.entity';
import UserLogs from '../user/entities/userLogs.entity';
import HackathonAsset from "../hackathon/entities/hackathonAsset.entity";
import {HackathonHistory} from "../hackathon/entities/hackathonHistory.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        // entities: [__dirname + '../**/entities/*.entity.ts'],
        entities: [Users, UserLogs, HackathonAsset, HackathonHistory],
        synchronize: false,
        logging: configService.get('QUERY_LOG_ENABLE') ? ['query', 'error'] : [],
      }),
    }),
  ],
})
export class DatabaseModule {}
