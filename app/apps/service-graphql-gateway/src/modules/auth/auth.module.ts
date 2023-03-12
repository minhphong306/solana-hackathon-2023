import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {CognitoAuthGuard} from './cognito.guard';
import {CognitoStrategy} from './cognito.strategy';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthService} from "./auth.service";
import {JwtStrategy} from './jwt.strategy';
import {AuthResolver} from "./auth.resolver";
import JwtAuthenticationGuard from "./jwt.guard";
import {TypeOrmModule} from "@nestjs/typeorm";
import User from "./entities/user.entity";
import {AuthController} from "./auth.controller";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {AuthConstant, TokenConstant} from "@mp-workspace/proto";
import {join} from "path";

@Module({
  imports: [
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

    ClientsModule.register([
      {
        name: TokenConstant.PackageName,
        transport: Transport.GRPC,
        options: {
          package: TokenConstant.Package,
          protoPath: join(__dirname, TokenConstant.Dir),
          url: `${TokenConstant.Host}:${TokenConstant.Port}`,
          loader: {
            keepCase: true
          }
        }
      }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    TypeOrmModule.forFeature([User])],
  providers: [AuthResolver, CognitoAuthGuard, AuthService, JwtAuthenticationGuard, JwtStrategy, CognitoStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
