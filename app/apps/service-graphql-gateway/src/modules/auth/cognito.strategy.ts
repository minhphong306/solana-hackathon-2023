import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {passportJwtSecret} from 'jwks-rsa';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ILoginJwtPayload} from "./interfaces/jwt-payload.interface";

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.COGNITO_AUTHORITY}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: process.env.COGNITO_AUTHORITY,
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async validate(payload: any) {
    const tokenPayload: ILoginJwtPayload = {
      walletAddress: payload["custom:wallet_address"],
      username: payload["sub"],
      nickname: payload["nickname"],
    };
    return tokenPayload;
  }
}
