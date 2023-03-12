import * as path from 'path';
import {Injectable} from '@nestjs/common';
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json';
import {GqlModuleOptions, GqlOptionsFactory} from '@nestjs/graphql';
import {ExtractJwt} from 'passport-jwt';
import * as jose from 'jose';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
// import { AuthService } from '../auth-module/auth.service';
import schemaDirectives from './directives';
import {basePath} from '../../environments/constants';
import { isTokenExpired } from '../../utils/jwt';
@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  // private readonly configService: ConfigService // private readonly authService: AuthService,
  private JWKS;
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async createGqlOptions(): Promise<GqlModuleOptions> {
    this.JWKS = jose.createRemoteJWKSet(new URL(`${process.env.COGNITO_AUTHORITY}/.well-known/jwks.json`), {timeoutDuration: 10000, cooldownDuration: 10000});
    return {
      typePaths: [`${basePath}/**/*.graphql`],
      definitions: {
        path: path.join(basePath, 'src', 'graphql.schema.ts'),
        outputAs: 'class',
      },
      resolvers: {
        JSON: GraphQLJSON,
        JSONObject: GraphQLJSONObject,
      },
      // tracing: true,
      schemaDirectives,
      debug: false,
      playground: {
        settings: {
          'editor.cursorShape': 'underline', // possible values: 'line', 'block', 'underline'
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.fontSize': 14,
          'editor.reuseHeaders': true, // new tab reuses headers from last tab
          'editor.theme': 'dark', // possible values: 'dark', 'light'
          'general.betaUpdates': true,
          'queryPlan.hideQueryPlanResponse': false,
          'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
          'tracing.hideTracingResponse': false,
        },
        // tabs: [
        // 	{
        // 		endpoint: END_POINT,
        // 		query: '{ hello }'
        // 	}
        // ]
      },
      installSubscriptionHandlers: true,
      // https://www.apollographql.com/docs/apollo-server/security/authentication/
      // context: async ({ req, res, connection }) => {
      context: async ({ req, connection }) => {
        const response = {
          currentUser: {},
          error: '',
        };
        try {
          if (connection) {
            const { currentUser } = connection.context;
            return {
              currentUser,
            };
          }

          const fromAuthHeaderAsBearerToken =
            ExtractJwt.fromAuthHeaderAsBearerToken();
          const accessToken = fromAuthHeaderAsBearerToken(req) || null;

          if (accessToken) {
            // verify access token
            const { payload: info } = await jose.jwtVerify(accessToken, this.JWKS, {
              issuer: process.env.COGNITO_AUTHORITY,
              audience: process.env.COGNITO_CLIENT_ID,
              algorithms: ['RS256']
            });
            // STEP ?: check if token is exits in redis
            const key = `${info.sub}:${accessToken}`;
            const isTokenExistInRedis = await this.redis.get(key);

            if (!isTokenExpired(info.exp)) {
              response.currentUser = {
                id: info['cognito:username'],
                roles: info['cognito:groups'] || [],
              };
            } else {
              response.currentUser = null;
              response.error = 'ACCESS_TOKEN_EXPIRED';
            }

            if (!isTokenExistInRedis) {
              response.currentUser = null;
              response.error = 'ACC_LOGGED_IN_BY_ANOTHER_DEVICE';
            }
          }
          return response;
        } catch (err) {
          console.log(err, 'graphql-module.context');
        }
      },
    };
  }
}
