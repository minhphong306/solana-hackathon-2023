import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {
  CancelRentingInput,
  HackathonAssetEntity,
  HackathonRentingHistory,
  HackathonRentingInput,
  InventoryInput,
  InventoryRes,
  ListRentingAssetInput,
  RentingListRes,
  RentRentingAssetInput,
  UpdateRentingAssetInput
} from '../../graphql.schema';
import {HackathonAssetService} from './hackathonAsset.service';
import type {ILoginJwtPayload} from "../auth/interfaces/jwt-payload.interface";
import {UseGuards} from "@nestjs/common";
import {CognitoAuthGuard} from "../auth/cognito.guard";
import {CurrentUser} from "../auth/decorators/user.decorator";

@Resolver('HackathonAsset')
export class HackathonAssetResolver {
  constructor(private readonly hackathonAssetService: HackathonAssetService) {}

  // Mutation
  @Mutation('listRentingAsset')
  @UseGuards(CognitoAuthGuard)
  async listRentingAsset(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: ListRentingAssetInput): Promise<boolean> {
    return this.hackathonAssetService.listRentingAsset(jwtPayload, input);
  }

  @Mutation('cancelRentingAsset')
  @UseGuards(CognitoAuthGuard)
  async cancelRentingAsset(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: CancelRentingInput): Promise<boolean> {
    return this.hackathonAssetService.cancelRentingAsset(jwtPayload, input);
  }

  @Mutation('updateRentingAsset')
  @UseGuards(CognitoAuthGuard)
  async updateRentingAsset(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: UpdateRentingAssetInput): Promise<boolean> {
    return this.hackathonAssetService.updateRentingAsset(jwtPayload, input);
  }

  @Mutation('rentRentingAsset')
  @UseGuards(CognitoAuthGuard)
  async rentRentingAsset(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input') input: RentRentingAssetInput): Promise<boolean> {
    return this.hackathonAssetService.rentRentingAsset(jwtPayload, input);
  }

  @Query('inventoryDetail')
  @UseGuards(CognitoAuthGuard)
  async inventoryDetail(@CurrentUser() jwtPayload: ILoginJwtPayload,@Args('nft') nft: string): Promise<HackathonAssetEntity> {
    return this.hackathonAssetService.getInventoryDetail(jwtPayload, nft);
  }

  @Query('inventory')
  @UseGuards(CognitoAuthGuard)
  async inventory(@CurrentUser() jwtPayload: ILoginJwtPayload, @Args('input')  input: InventoryInput): Promise<InventoryRes> {
    return this.hackathonAssetService.inventoryList(jwtPayload, input);
  }

  @Query('rentingList')
  async rentingList(@Args('input') input: HackathonRentingInput): Promise<RentingListRes> {
    return this.hackathonAssetService.getRentingList(input);
  }

  @Query('rentingDetail')
  async rentingDetail(@Args('nft') nft: string): Promise<HackathonAssetEntity> {
    return this.hackathonAssetService.getRentingDetail(nft);
  }

  @Query('rentingHistory')
  async rentingHistory(@Args('nft') nft: string): Promise<HackathonRentingHistory[]> {
    return this.hackathonAssetService.getRentingHistory(nft);
  }

  @Query('getTxInfo')
  async getTxInfo(@Args('tx') tx: string): Promise<string> {
    return this.hackathonAssetService.getTxInfo();
  }
}
