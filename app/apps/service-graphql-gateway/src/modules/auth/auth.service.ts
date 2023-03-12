import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {getRepository, In, Repository} from 'typeorm';
import {JwtService} from '@nestjs/jwt';
import {IJwtPayload} from './interfaces/jwt-payload.interface';
import Users from './entities/user.entity';
import {auth} from "@mp-workspace/proto";
import {v4 as uuidv4} from 'uuid';
import {Buffer} from "buffer";
import * as anchor from '@project-serum/anchor';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import {
  AdminCreateUserRequest,
  AdminDeleteUserRequest,
  AdminInitiateAuthRequest,
  AdminSetUserPasswordRequest,
  ChangePasswordRequest,
  ConfirmForgotPasswordRequest,
  ConfirmSignUpRequest,
  ForgotPasswordRequest,
  ListUsersRequest,
  ResendConfirmationCodeRequest,
  SignUpRequest,
  UpdateUserAttributesRequest
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {
  ICognitoAuthResponse,
  ICognitoChangePasswordResponse,
  ICognitoChangeUsernameResponse,
  ICognitoConfirmForgotPasswordResponse,
  ICognitoConfirmSignUpResponse,
  ICognitoCreateUserResponse,
  ICognitoDeleteUserResponse,
  ICognitoFindUserResponse,
  ICognitoForgotPasswordResponse,
  ICognitoResendCodeResponse,
  ICognitoSetPasswordResponse,
} from './interfaces/cognito-respose.interface';
import {getCognitoClient, GetCognitoClientInput, getCognitoTmpAccount} from '../../utils/cognito';
import {generateStrongPassword} from '../../utils/password';
import {getCognitoSecretHash} from '../../utils/cognitoSecretHash';
import {CognitoErrorCode} from '../../constant/cognito.error-code';
import {ConfigService} from '@nestjs/config';
import {InjectRedis} from '@liaoliaots/nestjs-redis';
import {Redis} from 'ioredis';
import {
  getRedisConfirmEmailCooldownKey,
  getRedisConfirmEmailDaily,
  getRedisForgotPasswordCooldownKey,
  getRedisForgotPasswordDaily
} from '../../utils/redisKey';
import {RedisExpireTimeSecond} from '../../constant/redis';
import {decrypt, encrypt} from "../../utils/encrypt";

import {decode} from "../../utils/jwt";
import {RpcException} from '@nestjs/microservices';
import {status} from "@grpc/grpc-js";

function getAllPrefix(redis: Redis, match: string) {
  return new Promise((resolve, reject) => {
    let keys = [];
    const stream = redis.scanStream({
      match,
    });
    stream.on('data', function (data) {
      keys = keys.concat(data);
    });
    stream.on('end', function () {
      resolve(keys);
    });
    stream.on('error', function (err) {
      reject(err);
    });
  });
}

@Injectable()
export class AuthService {
  private readonly config: GetCognitoClientInput;
  private readonly logger = new Logger(AuthService.name);
  private maxUsernameSameNumber: number;
  private redisCooldownTime: number;
  private redisDailyLimit: number;

  private algorithm = 'aes-128-ecb';
  private secretKey: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.config = {
      cognitoRegion: this.configService.get('COGNITO_REGION'),
      accessKey: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      cognitoPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      cognitoClientId: this.configService.get('COGNITO_CLIENT_ID'),
      cognitoClientSecret: this.configService.get('COGNITO_CLIENT_SECRET'),

      cognitoFieldWallet: 'custom:wallet_address'
    };
    this.maxUsernameSameNumber = this.configService.get('MAX_QUERY_RETRY');
    this.redisCooldownTime = this.configService.get('REDIS_COOLDOWN_TIME');
    this.redisDailyLimit = this.configService.get('REDIS_DAILY_LIMIT');

    this.secretKey = this.configService.get('ENCRYPT_PASSWORD_SECRET_KEY');
  }

  verifySignatures(signData: Buffer, signature, publicKey): boolean {
    if (
      !nacl.sign.detached.verify(signData, signature, publicKey.toBuffer())
    ) {
      return false;
    }
    return true;
  }

  verifyMessage(input: auth.SignInWithWalletInput) {
    const walletBuffers = bs58.decode(input.wallet);
    const msgBuffers = Buffer.from(input.message, 'utf8');
    const signBuffers = bs58.decode(input.signature);

    if (!nacl.sign.detached.verify(msgBuffers, signBuffers, walletBuffers)) {
      return false;
    }

    return true;
  }

  createSignature(message, secretKey) {
    return bs58.encode(nacl.sign.detached(message, secretKey));
  };

  findUserByWallet(wallet: string): Promise<Users> {
    return this.userRepo.findOne({
      where: [{
        walletAddress: wallet
      }]
    });
  }

  findUserByNickname(nickname: string): Promise<Users> {
    return this.userRepo.findOne({
      where: [{
        nickname: nickname
      }]
    });
  }

  findUserByAccount(email: string, password: string): Promise<Users> {
    return this.userRepo.findOne({
      where: [{
        email: email,
        encryptedPassword: encrypt(password)
      }]
    });
  }

  findUserByIdAndPassword(id: string, password: string): Promise<Users> {
    return this.userRepo.findOne(id, {
      where: [{
        encryptedPassword: encrypt(password)
      }]
    });
  }

  findUserById(id: string): Promise<Users> {
    return this.userRepo.findOne(id);
  }

  findUserByEmail(email: string): Promise<Users> {
    return this.userRepo.findOne({
      where: [{
        email: email
      }]
    });
  }

  generateCognitoToken(username: string, password: string) {
    return new Promise<ICognitoAuthResponse>((resolve, reject) => {
      const response: ICognitoAuthResponse = {
        error: '',
        accessToken: '',
        errorCode: '',
        token: ''
      };

      const client = getCognitoClient(this.config);

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);
      const authRequest: AdminInitiateAuthRequest = {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          'USERNAME': username,
          'PASSWORD': password,
          'SECRET_HASH': hash
        },
        ClientId: this.config.cognitoClientId,
        UserPoolId: this.config.cognitoPoolId
      };
      client.adminInitiateAuth(authRequest, function (err, data) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;

          return resolve(response);
        }
        response.accessToken = data.AuthenticationResult.IdToken;
        response.token = data.AuthenticationResult.AccessToken;
        return resolve(response);
      });
    });
  }

  deleteCognitoAccount(username: string) {
    return new Promise<ICognitoDeleteUserResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoDeleteUserResponse = {
        error: '',
        errorCode: ''
      };

      const params: AdminDeleteUserRequest = {
        UserPoolId: this.config.cognitoPoolId,
        Username: username
      };

      client.adminDeleteUser(params, function (err, data) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }
        return resolve(response);
      });
    });
  }

  createCognitoAccount(username: string, password: string, wallet: string) {
    return new Promise<ICognitoCreateUserResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoCreateUserResponse = {
        error: '',
        cognitoUserId: '',
        errorCode: ''
      };

      const params: AdminCreateUserRequest = {
        UserPoolId: this.config.cognitoPoolId,
        Username: username,
        DesiredDeliveryMediums: ['EMAIL'],
        ForceAliasCreation: false,
        MessageAction: 'SUPPRESS',
        TemporaryPassword: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: username
          },
          {
            Name: 'nickname',
            Value: wallet
          },
          {
            Name: this.config.cognitoFieldWallet,
            Value: wallet
          }
        ]
      };

      client.adminCreateUser(params, function (err, data) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }

        data.User.Attributes.forEach((attribute) => {
          if (attribute.Name === 'sub') {
            response.cognitoUserId = attribute.Value;
          }
        });

        return resolve(response);
      });
    });
  }

  setCognitoPassword(username: string, password: string) {
    return new Promise<ICognitoSetPasswordResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoSetPasswordResponse = {
        error: '',
        cognitoUserId: ''
      };

      const params: AdminSetUserPasswordRequest = {
        UserPoolId: this.config.cognitoPoolId,
        Username: username,
        Password: password,
        Permanent: true
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      client.adminSetUserPassword(params, function (err, data) {
        if (err) {
          response.error = err.message;
          return resolve(response);
        }

        return resolve(response);
      }
      );
    });
  }

  findCognitoUser(email: string) {
    return new Promise<ICognitoFindUserResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoFindUserResponse = {
        error: '',
        cognitoUserId: '',
        found: false,
        userStatus: '',
        username: '',
        walletAddress: '',
      };

      const params: ListUsersRequest = {
        UserPoolId: this.config.cognitoPoolId,
        AttributesToGet: ['sub', 'custom:wallet_address'],
        Filter: `email="${email}"`
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      client.listUsers(params, function (err, data) {
        if (err) {
          response.error = err.message;
          return resolve(response);
        }

        if (data.Users?.length === 0) {
          return resolve(response);
        }
        response.found = true;
        response.cognitoUserId = data.Users[0].Username;
        response.userStatus = data.Users[0].UserStatus;
        response.username = data.Users[0].Attributes['nickname'];
        response.walletAddress = data.Users[0].Attributes[1].Value;
        return resolve(response);
      }
      );
    });
  }

  isEmail(email: string) {
    const regexp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }

  signUpCognitoAccount(username: string, password: string, wallet: string, nickname: string) {
    return new Promise<ICognitoCreateUserResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoCreateUserResponse = {
        error: '',
        cognitoUserId: '',
        errorCode: ''
      };

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);

      const params: SignUpRequest = {
        ClientId: this.config.cognitoClientId,
        Username: username,
        Password: password,
        SecretHash: hash,
        UserAttributes: [
          {
            Name: 'email',
            Value: username
          },
          {
            Name: 'nickname',
            Value: nickname
          },
          {
            Name: this.config.cognitoFieldWallet,
            Value: wallet
          }
        ]
      };

      client.signUp(params, function (err, data) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }

        response.cognitoUserId = data.UserSub;

        return resolve(response);
      });
    });
  }

  confirmSignUpCognitoAccount(username: string, confirmationCode: string) {
    return new Promise<ICognitoConfirmSignUpResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoConfirmSignUpResponse = {
        error: '',
        errorCode: ''
      };

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);

      const params: ConfirmSignUpRequest = {
        ClientId: this.config.cognitoClientId,
        Username: username,
        SecretHash: hash,
        ConfirmationCode: confirmationCode
      };

      client.confirmSignUp(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }

        return resolve(response);
      });
    });
  }

  resendCognitoConfirmationCode(username: string) {
    return new Promise<ICognitoResendCodeResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoResendCodeResponse = {
        error: '',
        errorCode: ''
      };

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);

      const params: ResendConfirmationCodeRequest = {
        ClientId: this.config.cognitoClientId,
        Username: username,
        SecretHash: hash
      };

      client.resendConfirmationCode(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }
        return resolve(response);
      });
    });
  }

  cognitoForgotPassword(username: string) {
    return new Promise<ICognitoForgotPasswordResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoConfirmSignUpResponse = {
        error: '',
        errorCode: ''
      };

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);

      const params: ForgotPasswordRequest = {
        ClientId: this.config.cognitoClientId,
        Username: username,
        SecretHash: hash
      };

      client.forgotPassword(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }

        return resolve(response);
      });
    });
  }

  cognitoConfirmForgotPassword(username: string, password: string, code: string) {
    return new Promise<ICognitoConfirmForgotPasswordResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoConfirmSignUpResponse = {
        error: '',
        errorCode: ''
      };

      const hash = getCognitoSecretHash(username, this.config.cognitoClientSecret, this.config.cognitoClientId);

      const params: ConfirmForgotPasswordRequest = {
        ClientId: this.config.cognitoClientId,
        Username: username,
        SecretHash: hash,
        Password: password,
        ConfirmationCode: code
      };

      client.confirmForgotPassword(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }

        return resolve(response);
      });
    });
  }

  changeCognitoPassword(currentPassword: string, newPassword: string, token: string) {
    return new Promise<ICognitoChangePasswordResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoResendCodeResponse = {
        error: '',
        errorCode: ''
      };

      const params: ChangePasswordRequest = {
        AccessToken: token,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword
      };

      client.changePassword(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }
        return resolve(response);
      });
    });
  }

  changeCognitoUsername(newUsername: string, token: string) {
    return new Promise<ICognitoChangeUsernameResponse>((resolve, reject) => {
      const client = getCognitoClient(this.config);
      const response: ICognitoChangeUsernameResponse = {
        error: '',
        errorCode: ''
      };

      const params: UpdateUserAttributesRequest = {
        AccessToken: token,
        UserAttributes: [
          {
            Name: 'nickname',
            Value: newUsername
          }
        ]
      };

      client.updateUserAttributes(params, function (err) {
        if (err) {
          response.error = err.message;
          response.errorCode = err.code;
          return resolve(response);
        }
        return resolve(response);
      });
    });
  }

  async createRandomMessage(input: auth.CreateRandomMessageInput): Promise<auth.CreateRandomMessageResponse> {
    const payload: IJwtPayload = {message: uuidv4()};
    const res: auth.CreateRandomMessageResponse = {
      message: this.jwtService.sign(payload)
    };
    return res;
  }

  async getSignedMessage(input: auth.GetSignedMessageInput): Promise<auth.GetSignedMessageResponse> {
    const privKeyString = input.privateKey || '4pRSgnNYn5jYNc2s7kfEFBCwp4bWCbfGcuDULqGTMGohJ3zmLWvz5zzSWaXFrseYpWZW46v4CXBoiMpnecfFemND';
    const privKeyUint8 = new Uint8Array(bs58.decode(privKeyString));
    try {
      const myWallet = anchor.web3.Keypair.fromSecretKey(
        new Uint8Array(
          privKeyUint8
        )
      );

      const decodeMessage = Buffer.from(input.message, 'utf8');

      const sign = this.createSignature(decodeMessage, myWallet.secretKey);
      const res: auth.GetSignedMessageResponse = {
        message: sign
      };
      return res;
    } catch (err) {
      return err.toString();
    }
  }

  async signInWithWallet(input: auth.SignInWithWalletInput) {

    const response: auth.SignInWithWalletResponse = {
      isWalletLinked: false,
      isDontAskLink: false,
      accessToken: '',
      isConfirmed: false,
      email: '',
    };
    // Validate msg
    if (!this.verifyMessage(input)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Can't verify message`
      });
    }

    // Search user by wallet address (search db)
    const user = await this.findUserByWallet(input.wallet);
    // If user exist -> generate access token
    if (user) {
      response.isWalletLinked = true;
      response.email = user.email;
      const oauthRes = await this.tryGenerateCognitoToken(user);
      if (oauthRes.error) {
        if (oauthRes.errorCode === CognitoErrorCode.UserNotConfirmedException) {
          return response;
        }
        this.logger.error('Got oauth error: ', oauthRes.error);
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Can't login`
        });
      }

      if (user.isTmpAccount) {
        response.isWalletLinked = false;
      }

      response.isConfirmed = true;
      response.isDontAskLink = user.isDontAskLink;
      response.accessToken = oauthRes.accessToken;
      this.logger.debug(`Found user with wallet: ${JSON.stringify(user)}`);
      return response;
    }

    const username = getCognitoTmpAccount(input.wallet);
    const password = generateStrongPassword(8, input.wallet);

    const createAccountRes = await this.createCognitoAccount(username, password, input.wallet);

    // If user already exist -> user created in cognito but not created on database -> get user
    if (createAccountRes.errorCode == CognitoErrorCode.UsernameExistsException) {
      this.logger.debug(`User ${username} already exist. Start find user now`);
      const findUserRes = await this.findCognitoUser(username);
      if (findUserRes.error) {
        this.logger.error('Find user error: ', findUserRes.error);
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Something went wrong'
        });
      }

      createAccountRes.cognitoUserId = findUserRes.cognitoUserId;
      this.logger.debug(`Found user ${username} with cognito id: ${findUserRes.cognitoUserId}`);
    } else if (createAccountRes.error) {
      this.logger.error('Got create account error: ', createAccountRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const setPasswordRes = await this.setCognitoPassword(username, password);
    if (setPasswordRes.error) {
      this.logger.error('Got set password error: ', setPasswordRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const createUserRes = await this.createUser(createAccountRes.cognitoUserId, username, password, input.wallet, true, input.wallet);
    if (!createUserRes) {
      this.logger.error('Got error when create user');
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    this.logger.debug(`Created user ${createUserRes.id}`);

    const oauthRes = await this.generateCognitoToken(username, password);
    if (oauthRes.error) {
      this.logger.error('Got oauth error: ', oauthRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: `Can't login`
      });
    }

    response.isWalletLinked = false;
    response.isDontAskLink = createUserRes.isDontAskLink;
    response.accessToken = oauthRes.accessToken;
    return response;
  }

  async createUser(cognitoId: string, email: string, password: string, wallet: string, isTmp: boolean, nickname: string) {
    const user = await this.userRepo.create({
      id: cognitoId,
      email: email,
      encryptedPassword: encrypt(password),
      nickname: nickname,
      isTmpAccount: isTmp,
      walletAddress: wallet,
      isDontAskLink: false
    });

    if (!isTmp) {
      user.isDontAskLink = true;
    }

    await this.userRepo.save(user);
    return user;
  }

  async deleteUser(cognitoId: string) {
    const user = await this.userRepo.findOne(cognitoId);
    if (user) {
      return await this.userRepo.delete(cognitoId);
    }
    return true;
  }

  async updateUser(user: Users): Promise<Users> {
    await this.userRepo.update(user.id, {...user});
    return this.userRepo.findOne(user.id);
  }

  async findUsersByWallets(wallets: string[]): Promise<Users[]> {
    return await getRepository(Users)
      .find({
        where: {
          walletAddress: In(wallets),
        }
      });
  }

  async signInWithAccount(input: auth.SignInWithAccountInput): Promise<auth.SignInWithAccountResponse> {
    const response: auth.SignInWithAccountResponse = {
      isWalletLinked: false,
      isConfirmed: false
    };

    const user = await this.findUserByAccount(input.username, input.password);

    if (!user) {
      this.logger.error('Wrong email or password');
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong email or password'
      });
    }

    if (!user.walletAddress) {
      return response;
    }

    response.isWalletLinked = true;

    const oauthRes = await this.generateCognitoToken(input.username, input.password);
    if (oauthRes.error) {
      if (oauthRes.errorCode === CognitoErrorCode.UserNotConfirmedException) {
        return response;
      }

      this.logger.error('Got oauth error: ', oauthRes.error);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Can't login`
      });
    }

    if (user.isTmpAccount) {
      return response;
    }

    response.isConfirmed = true;
    response.accessToken = oauthRes.accessToken;

    const userInfo = decode(oauthRes.accessToken);
    const userId = userInfo?.sub;
    if (userInfo && userId) {
      const key = `${userId}:${oauthRes.accessToken}`;
      // Step 1: search old access token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const keys: any = await getAllPrefix(this.redis, `${userId}:*`);
      // Step 2: delete old keys
      for (let i = 0; i < keys.length; i += 1) {
        await this.redis.del(keys[i]);
      }
      // Step 3: save new cache
      const A_DAY_IN_SECONDS = 1 * 60 * 60 * 24;
      await this.redis.set(key, 1, 'EX', A_DAY_IN_SECONDS);
    }

    return response;
  }

  async tryGenerateCognitoToken(user: Users): Promise<ICognitoAuthResponse> {
    return this.generateCognitoToken(user.email, decrypt(user.encryptedPassword));
  }

  async getUniqueNickname(nickname: string): Promise<string> {
    let user = await this.findUserByNickname(nickname);
    if (!user) {
      return nickname;
    }

    let tmp = 1;
    while (tmp <= this.maxUsernameSameNumber) {
      user = await this.findUserByNickname(nickname + tmp);
      if (!user) {
        return nickname + tmp;
      }
      tmp++;
    }

    return '';
  }

  async signUpWithWallet(input: auth.SignUpWithWalletInput): Promise<auth.SignUpWithWalletResponse> {
    const response: auth.SignUpWithWalletResponse = {
      cognitoUserId: ''
    };

    if (!this.isEmail(input.username)) {
      this.logger.debug(`Invalid email format`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Enter a valid email'
      });
    }

    let user = await this.findUserByWallet(input.jwtPayload.walletAddress);
    if (user) {
      if (!user.isTmpAccount) {
        this.logger.debug(`Wallet is already linked: ${input.jwtPayload.walletAddress}`);
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Wallet is already linked'
        });
      }
    }

    user = await this.findUserByEmail(input.username);
    if (user) {
      this.logger.debug(`Email already exists: ${input.username}`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Email already exists'
      });
    }

    if (input.username.length > 128) {
      this.logger.debug(`Email too long: ${input.username}`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Your email is too long'
      });
    }

    if (input.password.length > 256) {
      this.logger.debug(`Password too long: ${input.password}`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Your password is too long'
      });
    }


    const rawNickname = input.username.split('@');
    let nickname = '';
    if (rawNickname && rawNickname.length > 0) {
      nickname = rawNickname[0];
    }
    nickname = await this.getUniqueNickname(nickname);
    if (!nickname) {
      this.logger.debug(`Reach max same number of usernames`);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Username has been taken'
      });
    }

    const signUpAccountRes = await this.signUpCognitoAccount(input.username, input.password, input.jwtPayload.walletAddress, nickname);
    if (signUpAccountRes.errorCode) {
      if (signUpAccountRes.errorCode === CognitoErrorCode.InvalidPasswordException) {
        this.logger.debug(`Got create account error: `, signUpAccountRes.error);
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Password has to include 8 or more characters with a mix of upper letters, normal letters, numbers & symbols`
        });
      }
      this.logger.debug(`Got create account error: `, signUpAccountRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: signUpAccountRes.error
      });
    }

    const deleteTmpAccountRes = await this.deleteCognitoAccount(input.jwtPayload.cognitoUserId);
    if (deleteTmpAccountRes.error && deleteTmpAccountRes.errorCode != CognitoErrorCode.UserNotFoundException) {
      this.logger.error('Delete Cognito user error: ', deleteTmpAccountRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const deleteUserRes = await this.deleteUser(input.jwtPayload.cognitoUserId);
    if (!deleteUserRes) {
      this.logger.error('Got error when delete temp user');
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const createUserRes = await this.createUser(signUpAccountRes.cognitoUserId, input.username, input.password, input.jwtPayload.walletAddress, false, nickname);
    if (!createUserRes) {
      this.logger.error('Got error when create user');
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    await this.redis.set(getRedisConfirmEmailCooldownKey(input.jwtPayload.walletAddress), "true", "EX", this.redisCooldownTime);

    this.logger.debug(`Created user ${createUserRes.id}`);

    response.cognitoUserId = signUpAccountRes.cognitoUserId;
    return response;
  }

  async dontAskAgain(input: auth.LoginJwtPayload): Promise<auth.DontAskAgainResponse> {
    const response: auth.DontAskAgainResponse = {
      message: false
    };
    const user = await this.findUserByWallet(input.walletAddress);
    const updateUser = user;
    updateUser.isDontAskLink = true;
    const updateUserRes = this.updateUser(user);
    if (!updateUserRes || !updateUser.isDontAskLink) {
      this.logger.debug(`Error when saving is_dont_ask_link`);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }
    response.message = true;
    return response;
  }

  async confirmEmail(input: auth.ConfirmEmailInput): Promise<auth.ConfirmEmailResponse> {
    const response: auth.ConfirmEmailResponse = {
      accessToken: ''
    };

    const user = await this.findUserByEmail(input.email);
    if (!user) {
      this.logger.debug(`Cannot find user with email: `, input.email);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Got confirm email error'
      });
    }

    const confirmSignUpCognitoAccount = await this.confirmSignUpCognitoAccount(input.email, input.code);
    if (confirmSignUpCognitoAccount.errorCode) {
      this.logger.debug(`Got confirm email error: `, confirmSignUpCognitoAccount.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: confirmSignUpCognitoAccount.error
      });
    }

    const oauthRes = await this.tryGenerateCognitoToken(user);
    if (oauthRes.error) {
      this.logger.error('Got oauth error: ', oauthRes.error);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Can't login`
      });
    }

    response.accessToken = oauthRes.accessToken;
    this.logger.debug(`User ${JSON.stringify(user)} has been confirmed`);
    return response;
  }

  async resendConfirmationCode(input: auth.ResendConfirmationCodeInput): Promise<auth.ResendConfirmationCodeResponse> {
    const response: auth.ResendConfirmationCodeResponse = {
      isSent: false
    };

    const findUserRes = await this.findCognitoUser(input.email);
    if (findUserRes.error) {
      this.logger.error('Find user error: ', findUserRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    if (!findUserRes.found) {
      this.logger.error('User is not exist: ', input.email);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong email'
      });
    }

    if (findUserRes.userStatus === CognitoErrorCode.Confirmed) {
      this.logger.error(`User ${input.email} is confirmed`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `User ${input.email} is confirmed`
      });
    }

    const redisCooldownKey = getRedisConfirmEmailCooldownKey(findUserRes.walletAddress);
    const redisLimitKey = getRedisConfirmEmailDaily(findUserRes.walletAddress);

    const dailyLimit = await this.redis.get(redisLimitKey);
    if (parseInt(dailyLimit) >= this.redisDailyLimit) {
      this.logger.debug(`Got confirm email error: User with wallet ${findUserRes.walletAddress} reached daily limit`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Reached daily limit`
      });
    }

    if (!dailyLimit) {
      await this.redis.set(redisLimitKey, "0", "EX", RedisExpireTimeSecond.TwentyFourHours);
    }

    const isCoolingDown = await this.redis.get(redisCooldownKey);
    if (isCoolingDown) {
      return response;
    }

    await this.redis.incr(redisLimitKey);
    await this.redis.set(redisCooldownKey, "true", "EX", this.redisCooldownTime);

    const resendCognitoCodeRes = await this.resendCognitoConfirmationCode(input.email);
    if (resendCognitoCodeRes.errorCode) {
      this.logger.debug(`Resend confirmation code error: `, resendCognitoCodeRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Resend confirmation code error'
      });
    }

    response.isSent = true;
    return response;
  }

  async forgotPassword(input: auth.ForgotPasswordInput): Promise<auth.ForgotPasswordResponse> {
    const response: auth.ForgotPasswordResponse = {
      isSent: false
    };

    const user = await this.findUserByEmail(input.email);
    if (!user) {
      this.logger.error('Got forgot password error: No user with email ', input.email);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `No user with email ${input.email}`
      });
    }

    const redisCooldownKey = getRedisForgotPasswordCooldownKey(user.walletAddress);
    const redisLimitKey = getRedisForgotPasswordDaily(user.walletAddress);

    const dailyLimit = await this.redis.get(redisLimitKey);
    if (parseInt(dailyLimit) >= this.redisDailyLimit) {
      this.logger.debug(`Got forgot password error: User with wallet ${user.walletAddress} reached daily limit`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Reached daily limit'
      });
    }

    if (!dailyLimit) {
      await this.redis.set(redisLimitKey, "0", "EX", RedisExpireTimeSecond.TwentyFourHours);
    }

    const isCoolingDown = await this.redis.get(redisCooldownKey);
    if (isCoolingDown) {
      return response;
    }

    await this.redis.incr(redisLimitKey);
    await this.redis.set(redisCooldownKey, "true", "EX", this.redisCooldownTime);

    const forgotPasswordRes = await this.cognitoForgotPassword(input.email);
    if (forgotPasswordRes.error) {
      this.logger.debug(`Got forgot password error: `, forgotPasswordRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    response.isSent = true;
    return response;
  }

  async confirmForgotPassword(input: auth.ConfirmForgotPasswordInput): Promise<auth.ConfirmForgotPasswordResponse> {
    const response: auth.ConfirmForgotPasswordResponse = {
      isSet: false
    };

    const user = await this.findUserByEmail(input.email);
    if (!user) {
      this.logger.error('Got forgot password error: No user with email ', input.email);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `No user with email ${input.email}`
      });
    }

    const confirmForgotPasswordRes = await this.cognitoConfirmForgotPassword(input.email, input.password, input.code);
    if (confirmForgotPasswordRes.error) {
      this.logger.debug(`Got forgot password error: `, confirmForgotPasswordRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: confirmForgotPasswordRes.error
      });
    }

    user.encryptedPassword = encrypt(input.password);

    const updateUserRes = this.updateUser(user);
    if (!updateUserRes) {
      this.logger.debug(`Error when saving new password`);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    response.isSet = true;
    return response;
  }

  async profileInfo(input: auth.LoginJwtPayload): Promise<auth.ProfileInfoResponse> {
    const response: auth.ProfileInfoResponse = {
      walletAddress: '',
      email: '',
      nickname: '',
      isWalletLinked: false,
      isEmailConfirmed: false,
      isChangedNickName: false,
    };

    if (input.walletAddress) {
      response.walletAddress = input.walletAddress;
    }
    if (input.nickname) {
      response.nickname = input.nickname;
    }

    let user: Users;
    if (input.walletAddress) {
      user = await this.findUserByWallet(input.walletAddress);
    }
    if (input.cognitoUserId) {
      user = await this.findUserById(input.cognitoUserId);
    }

    if (!user) {
      this.logger.debug(`User not found. Wallet address: `, input.walletAddress);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }
    const findUserRes = await this.findCognitoUser(user.email);
    if (findUserRes.error) {
      this.logger.error('Find user error: ', findUserRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    if (!findUserRes.found) {
      this.logger.error('User is not exist: ', user.email);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong email'
      });
    }
    response.isWalletLinked = !user.isTmpAccount;
    response.email = user.email;
    response.isChangedNickName = user.isChangedNickName;
    response.isEmailConfirmed = (!user.isTmpAccount && findUserRes.userStatus === CognitoErrorCode.Confirmed) && true;
    return response;
  }

  async changePassword(input: auth.ChangePasswordInput): Promise<auth.ChangePasswordResponse> {
    const response: auth.ChangePasswordResponse = {
      accessToken: ''
    };

    const user = await this.findUserByIdAndPassword(input.jwtPayload.cognitoUserId, input.currentPassword);

    if (!user) {
      this.logger.error('Failed to change password: Wrong password');
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Wrong password'
      });
    }

    const getAccessTokenRes = await this.generateCognitoToken(input.jwtPayload.cognitoUserId, input.currentPassword);
    if (getAccessTokenRes.error) {
      this.logger.error('Got oauth error: ', getAccessTokenRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const changeCognitoPasswordRes = await this.changeCognitoPassword(input.currentPassword, input.newPassword, getAccessTokenRes.token);
    if (changeCognitoPasswordRes.errorCode) {
      this.logger.debug(`Got change password error: `, changeCognitoPasswordRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: changeCognitoPasswordRes.error
      });
    }

    user.encryptedPassword = encrypt(input.newPassword);

    const updateUserRes = this.updateUser(user);
    if (!updateUserRes) {
      this.logger.debug(`Error when saving new password`);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const oauthRes = await this.generateCognitoToken(input.jwtPayload.cognitoUserId, input.newPassword);
    if (oauthRes.error) {
      this.logger.error('Got oauth error: ', oauthRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }
    response.accessToken = oauthRes.accessToken;
    return response;
  }

  async changePasswordInGame(input: auth.ChangePasswordInput): Promise<auth.ChangePasswordResponse> {
    const resp = await this.changePassword(input);
    if (resp) {
      if (resp.accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const key = `${input.jwtPayload.cognitoUserId}:${resp.accessToken}`;
        // Step 1: search old access token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keys: any = await getAllPrefix(this.redis, `${input.jwtPayload.cognitoUserId}:*`);
        // Step 2: delete old keys
        for (let i = 0; i < keys.length; i += 1) {
          await this.redis.del(keys[i]);
        }
        // Step 3: save new cache
        const A_DAY_IN_SECONDS = 1 * 60 * 60 * 24;
        await this.redis.set(key, 1, 'EX', A_DAY_IN_SECONDS);
      }
    }
    return resp;
  }

  async changeUsernameInGame(input: auth.ChangeUsernameInput): Promise<auth.ChangeUsernameResponse> {
    const resp = await this.changeUsername(input);
    if (resp) {
      if (resp.accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const key = `${input.jwtPayload.cognitoUserId}:${resp.accessToken}`;
        // Step 1: search old access token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keys: any = await getAllPrefix(this.redis, `${input.jwtPayload.cognitoUserId}:*`);
        // Step 2: delete old keys
        for (let i = 0; i < keys.length; i += 1) {
          await this.redis.del(keys[i]);
        }
        // Step 3: save new cache
        const A_DAY_IN_SECONDS = 1 * 60 * 60 * 24;
        await this.redis.set(key, 1, 'EX', A_DAY_IN_SECONDS);
      }
    }
    return resp;
  }

  async changeUsername(input: auth.ChangeUsernameInput): Promise<auth.ChangeUsernameResponse> {
    const response: auth.ChangeUsernameResponse = {
      accessToken: ''
    };

    if (input.username.length > 28) {
      this.logger.error('Failed to change username: Your name is too long');
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Your name is too long, up to 28 characters'
      });
    }

    if (input.username.length < 6) {
      this.logger.error('Failed to change username: Your name is too short');
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Your name is too short, at least 6 characters'
      });
    }

    const checkUsername = await this.findUserByNickname(input.username);
    if (checkUsername) {
      this.logger.error('Failed to change username: username has been taken by ', checkUsername.id);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Username has been taken'
      });
    }

    let user = await this.findUserByWallet(input.jwtPayload.walletAddress);
    if (!user) {
      user = await this.findUserById(input.jwtPayload.cognitoUserId);
    }

    if (!user) {
      this.logger.error('Failed to change username: Cannot find user by wallet');
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    const getAccessTokenRes = await this.tryGenerateCognitoToken(user);
    if (getAccessTokenRes.error) {
      this.logger.error('Got oauth error: ', getAccessTokenRes.error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Something went wrong'
      });
    }

    if (user.isChangedNickName) {
      this.logger.debug(`Got change username error: Name has been changed`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Name has been changed'
      });
    }

    const changeCognitoUsernameRes = await this.changeCognitoUsername(input.username, getAccessTokenRes.token);
    if (changeCognitoUsernameRes.errorCode) {
      this.logger.debug(`Got change username error: `, changeCognitoUsernameRes.error);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: changeCognitoUsernameRes.error
      });
    }

    user.nickname = input.username;
    user.isChangedNickName = true;

    const updateUserRes = this.updateUser(user);
    if (!updateUserRes) {
      this.logger.debug(`Error when saving new username`);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Something went wrong'
      });
    }

    const oauthRes = await this.tryGenerateCognitoToken(user);
    if (oauthRes.error) {
      this.logger.error('Got oauth error: ', oauthRes.error);
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Something went wrong'
      });
    }
    response.accessToken = oauthRes.accessToken;

    return response;
  }
}
