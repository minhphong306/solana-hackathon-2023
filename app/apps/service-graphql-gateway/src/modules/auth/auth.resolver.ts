import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {HttpException, HttpStatus, Inject, OnModuleInit, UseGuards} from '@nestjs/common';
import JwtAuthenticationGuard from './jwt.guard';
import {
  ChangePasswordInput,
  ChangeUsernameInput,
  ConfirmEmailInput,
  ConfirmForgotPasswordInput,
  ForgotPasswordInput,
  GetSignedMessageInput,
  ResendCodeInput,
  SignInWithAccountInput,
  SignInWithWalletInput,
  SignUpWithWalletInput
} from '../../graphql.schema';
import {CurrentUser} from './decorators/user.decorator';
import type {IJwtPayload, ILoginJwtPayload} from './interfaces/jwt-payload.interface';
import {CognitoAuthGuard} from './cognito.guard';
import {auth, AuthConstant, token, TokenConstant} from "@mp-workspace/proto";
import {ClientGrpc} from "@nestjs/microservices";
import {getHttpCodeFromGrpcCode} from "../../utils/grpc.error-code";

@Resolver('Auth')
export class AuthResolver implements OnModuleInit {
  private tokenGRPCservice: token.TokenService;

  constructor(
    private readonly authService: AuthService,
    @Inject(AuthConstant.PackageName) private client: ClientGrpc,
    @Inject(TokenConstant.PackageName) private tokenClient: ClientGrpc,
  ) {
  }

  onModuleInit() {
    this.tokenGRPCservice = this.tokenClient.getService(TokenConstant.ServiceName);
  }

  @Mutation('createRandomMessage')
  async createRandomMessage() {
    try {
      const response = await this.authService.createRandomMessage(null);
      return response.message;
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('getSignedMessage')
  async getSignedMessage(@Args('input') input: GetSignedMessageInput): Promise<auth.GetSignedMessageResponse> {
    try {
      return await this.authService.getSignedMessage({
        message: input.message,
        privateKey: input.privateKey,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('signInWithWallet')
  @UseGuards(JwtAuthenticationGuard)
  async signInWithWallet(@CurrentUser() jwtPayload: IJwtPayload, @Args('input') input: SignInWithWalletInput): Promise<auth.SignInWithWalletResponse> {
    if (jwtPayload.message !== input.message) {
      throw new HttpException(
        'Invalid random message',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      return await this.authService.signInWithWallet({
        wallet: input.wallet,
        message: input.message,
        signature: input.signature,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('signInWithAccount')
  async signInWithAccount(@Args('input') input: SignInWithAccountInput): Promise<auth.SignInWithAccountResponse> {
    try {
      return await this.authService.signInWithAccount({
        username: input.username,
        password: input.password,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('signUpWithWallet')
  @UseGuards(CognitoAuthGuard)
  async signUpWithWallet(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: SignUpWithWalletInput): Promise<auth.SignUpWithWalletResponse> {
    try {
      return await this.authService.signUpWithWallet({
        username: input.username,
        password: input.password,
        jwtPayload: {
          walletAddress: jwtPayload.walletAddress,
          nickname: jwtPayload.nickname,
          cognitoUserId: jwtPayload.username
        }
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('dontAskAgain')
  @UseGuards(CognitoAuthGuard)
  async dontAskAgain(@CurrentUser() jwtPayload: ILoginJwtPayload) {
    try {
      const response = await this.authService.dontAskAgain({
        walletAddress: jwtPayload.walletAddress,
        nickname: jwtPayload.nickname,
        cognitoUserId: jwtPayload.username
      });
      return response.message;
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('confirmEmail')
  async confirmEmail(@Args('input') input: ConfirmEmailInput): Promise<auth.ConfirmEmailResponse> {
    try {
      return await this.authService.confirmEmail({
        email: input.email,
        code: input.code
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('resendConfirmationCode')
  async resendConfirmationCode(@Args('input') input: ResendCodeInput): Promise<auth.ResendConfirmationCodeResponse> {
    try {

      return await this.authService.resendConfirmationCode({
        email: input.email,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('forgotPassword')
  async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<auth.ForgotPasswordResponse> {
    try {
      return await this.authService.forgotPassword({
        email: input.email,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('confirmForgotPassword')
  async confirmForgotPassword(@Args('input') input: ConfirmForgotPasswordInput): Promise<auth.ConfirmForgotPasswordResponse> {
    try {
      return await this.authService.confirmForgotPassword({
        email: input.email,
        password: input.password,
        code: input.code,
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Query('profileInfo')
  @UseGuards(CognitoAuthGuard)
  async profileInfo(@CurrentUser() jwtPayload: ILoginJwtPayload): Promise<auth.ProfileInfoResponse> {
    try {
      return await this.authService.profileInfo({
        walletAddress: jwtPayload.walletAddress,
        nickname: jwtPayload.nickname,
        cognitoUserId: jwtPayload.username
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('changePassword')
  @UseGuards(CognitoAuthGuard)
  async changePassword(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: ChangePasswordInput): Promise<auth.ChangePasswordResponse> {
    try {
      return await this.authService.changePassword({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        jwtPayload: {
          walletAddress: jwtPayload.walletAddress,
          nickname: jwtPayload.nickname,
          cognitoUserId: jwtPayload.username
        }
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation('changeUsername')
  @UseGuards(CognitoAuthGuard)
  async changeUsername(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: ChangeUsernameInput): Promise<auth.ChangeUsernameResponse> {
    try {
      return await this.authService.changeUsername({
        username: input.username,
        jwtPayload: {
          walletAddress: jwtPayload.walletAddress,
          nickname: jwtPayload.nickname,
          cognitoUserId: jwtPayload.username
        }
      });
    } catch (e) {
      if (e && e.details) {
        throw new HttpException(e.details, getHttpCodeFromGrpcCode(e.code));
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
