import {Body, Controller, HttpException, HttpStatus, Logger, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import type {IGetUsersByWalletsRequest, IGetUsersByWalletsResponse} from "./interfaces/http-payload";
import {ConfigService} from "@nestjs/config";

@Controller("/auth")
export class AuthController {
  private readonly logger = new Logger(AuthService.name);
  private secretKey: string;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get('HTTP_SECRET_KEY') || '8hqEQ,ud??_Zg,H5';
  }

  @Post("/getUsersByWallets")
  async GetAssetRest(@Body() input: IGetUsersByWalletsRequest): Promise<IGetUsersByWalletsResponse[]> {
    console.info(`Got get user by wallet request: ${JSON.stringify(input)}`);
    if (input.secretKey !== this.secretKey) {
      throw new HttpException('Invalid secret key', HttpStatus.BAD_REQUEST);
    }

    if (!input.wallets) {
      throw new HttpException('Missing wallet address', HttpStatus.BAD_REQUEST);
    }

    const data = await this.authService.findUsersByWallets(input.wallets);
    if (!data) {
      return [];
    }

    return data.map(item => {
      return {
        id: item.id,
        wallet: item.walletAddress
      };
    });
  }

}
