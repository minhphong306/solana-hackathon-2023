import {Module} from '@nestjs/common';
import {HackathonAssetResolver} from './hackathonAsset.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HackathonAssetService} from './hackathonAsset.service';
import {HackathonAsset} from './entities/hackathonAsset.entity';
import {join} from "path";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {AssetConstant, AuthConstant} from "@mp-workspace/proto";
import {CognitoAuthGuard} from "../auth/cognito.guard";
import {CognitoStrategy} from "../auth/cognito.strategy";
import HackathonHistory from "./entities/hackathonHistory.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([HackathonAsset, HackathonHistory]), ClientsModule.register([
      {
        name: AssetConstant.PackageName,
        transport: Transport.GRPC,
        options: {
          package: AssetConstant.Package,
          protoPath: join(__dirname, AssetConstant.Dir),
          url: `${AssetConstant.Host}:${AssetConstant.Port}`,
          loader: {
            keepCase: true,
          }
        },
      },
    ]),

    ClientsModule.register([
      {
        name: AuthConstant.PackageName,
        transport: Transport.GRPC,
        options: {
          package: AuthConstant.Package,
          protoPath: join(__dirname, AuthConstant.Dir),
          url: `${AuthConstant.Host}:${AuthConstant.Port}`,
          loader: {
            keepCase: true
          }
        }
      }
    ]),
  ],
  providers: [HackathonAssetResolver, CognitoAuthGuard, CognitoStrategy, HackathonAssetService],
})
export class HackathonAssetModule {}
