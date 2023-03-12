
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum TokenTransactionType {
    WALLET = "WALLET",
    BOT = "BOT"
}

export class GetAssetsInput {
    id?: Nullable<string>;
    type?: Nullable<number>;
    nft?: Nullable<string>;
    subType?: Nullable<number>;
    tier?: Nullable<number>;
    limit?: Nullable<number>;
    page?: Nullable<number>;
    orderBy?: Nullable<string>;
}

export class GetAssetPartByNFTAddressOrIDInput {
    idNumber?: Nullable<number>;
    nftAddress?: Nullable<string>;
}

export class SyncSingleNFTInput {
    nft: string;
}

export class SwapRobotLogInput {
    type: number;
    userId: string;
    walletAddress: string;
    tx: string;
    nftAddress: string;
    metadata: JSON;
}

export class LinkWalletInput {
    wallet: string;
}

export class SignInWithWalletInput {
    wallet: string;
    message: string;
    signature: string;
}

export class SignInWithAccountInput {
    username: string;
    password: string;
}

export class ResendCodeInput {
    email: string;
}

export class SignUpAccountInput {
    username: string;
    password: string;
}

export class SignUpWithWalletInput {
    username: string;
    password: string;
}

export class ConfirmEmailInput {
    email: string;
    code: string;
}

export class ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

export class ChangeUsernameInput {
    username: string;
}

export class ForgotPasswordInput {
    email: string;
}

export class ConfirmForgotPasswordInput {
    email: string;
    password: string;
    code: string;
}

export class GetSignedMessageInput {
    message?: Nullable<string>;
    privateKey?: Nullable<string>;
}

export class HackathonRentingFilter {
    min?: Nullable<number>;
    max?: Nullable<number>;
}

export class HackathonRentingInput {
    price?: Nullable<HackathonRentingFilter>;
    type?: Nullable<number>;
    subType?: Nullable<number>;
    tier?: Nullable<number>;
    rentTime?: Nullable<HackathonRentingFilter>;
    search?: Nullable<string>;
    limit?: Nullable<number>;
    page?: Nullable<number>;
    order?: Nullable<string>;
    orderBy?: Nullable<number>;
}

export class InventoryInput {
    price?: Nullable<HackathonRentingFilter>;
    type?: Nullable<number>;
    subType?: Nullable<number>;
    tier?: Nullable<number>;
    rentTime?: Nullable<HackathonRentingFilter>;
    search?: Nullable<string>;
    limit?: Nullable<number>;
    page?: Nullable<number>;
    order?: Nullable<string>;
    orderBy?: Nullable<number>;
    status?: Nullable<number>;
}

export class ListRentingAssetInput {
    tx?: Nullable<string>;
    price?: Nullable<number>;
    numberOfDay?: Nullable<number>;
    isContinueListing?: Nullable<boolean>;
    nftAddress?: Nullable<string>;
}

export class CancelRentingInput {
    tx?: Nullable<string>;
    nft?: Nullable<string>;
}

export class UpdateRentingAssetInput {
    tx?: Nullable<string>;
    nft?: Nullable<string>;
    price?: Nullable<number>;
    numberOfDay?: Nullable<number>;
    isContinueListing?: Nullable<boolean>;
}

export class RentRentingAssetInput {
    tx?: Nullable<string>;
    nft?: Nullable<string>;
}

export class DepositTokenInput {
    tx: string;
    type: TokenTransactionType;
}

export class WithdrawTokenInput {
    type: TokenTransactionType;
    amount: number;
}

export class ClaimTokenInput {
    amount: number;
}

export class SearchUsersInput {
    searchText: string;
}

export class DeleteUserUnverifiedEmailInput {
    userId: string;
}

export interface Node {
    _id: string;
}

export interface PageInfo {
    total?: Nullable<number>;
}

export class AssetResponse {
    id: string;
    userId: string;
    nft: string;
    type: number;
    tier: number;
    subType: number;
    name: string;
    image?: Nullable<string>;
    description?: Nullable<string>;
    attributes?: Nullable<string>;
    baseAttributes?: Nullable<string>;
}

export class AssetAggregateResponse {
    totalCount: number;
}

export class SyncAssetStatusResponse {
    isDone: boolean;
}

export class SyncAssetResponse {
    success: boolean;
    message?: Nullable<string>;
    timeRemaining?: Nullable<number>;
}

export class SwapRobotLogResponse {
    success: boolean;
}

export class TestAssetResponse {
    id: number;
    name: string;
}

export abstract class IQuery {
    abstract assets(input?: Nullable<GetAssetsInput>): Nullable<Nullable<AssetResponse>[]> | Promise<Nullable<Nullable<AssetResponse>[]>>;

    abstract assetsAggregate(input: GetAssetsInput): Nullable<AssetAggregateResponse> | Promise<Nullable<AssetAggregateResponse>>;

    abstract asset(input?: Nullable<GetAssetsInput>): Nullable<AssetResponse> | Promise<Nullable<AssetResponse>>;

    abstract syncAssetStatus(): Nullable<SyncAssetStatusResponse> | Promise<Nullable<SyncAssetStatusResponse>>;

    abstract getAssetPartByNFTAddressOrID(input?: Nullable<GetAssetPartByNFTAddressOrIDInput>): Nullable<AssetResponse> | Promise<Nullable<AssetResponse>>;

    abstract testAsset(id?: Nullable<number>): TestAssetResponse | Promise<TestAssetResponse>;

    abstract profileInfo(): Nullable<ProfileInfoResponse> | Promise<Nullable<ProfileInfoResponse>>;

    abstract rentingList(input?: Nullable<HackathonRentingInput>): Nullable<RentingListRes> | Promise<Nullable<RentingListRes>>;

    abstract rentingDetail(nft?: Nullable<string>): Nullable<HackathonAssetEntity> | Promise<Nullable<HackathonAssetEntity>>;

    abstract rentingHistory(nft?: Nullable<string>): Nullable<Nullable<HackathonRentingHistory>[]> | Promise<Nullable<Nullable<HackathonRentingHistory>[]>>;

    abstract inventoryDetail(nft?: Nullable<string>): HackathonInventoryEntity | Promise<HackathonInventoryEntity>;

    abstract inventory(input?: Nullable<InventoryInput>): Nullable<InventoryRes> | Promise<Nullable<InventoryRes>>;

    abstract getTxInfo(tx?: Nullable<string>): Nullable<string> | Promise<Nullable<string>>;

    abstract tokenConfig(): TokenConfig | Promise<TokenConfig>;

    abstract tokenAggregate(): TokenAggregate | Promise<TokenAggregate>;

    abstract tokenProcessingStatus(): TokenProcessingStatus | Promise<TokenProcessingStatus>;

    abstract me(): Nullable<UserEntity> | Promise<Nullable<UserEntity>>;

    abstract searchUsers(input: SearchUsersInput): UserEntity[] | Promise<UserEntity[]>;

    abstract walletConfig(): WalletConfig | Promise<WalletConfig>;
}

export abstract class IMutation {
    abstract syncAsset(txs?: Nullable<Nullable<string>[]>): Nullable<SyncAssetResponse> | Promise<Nullable<SyncAssetResponse>>;

    abstract syncSingleNFT(input?: Nullable<SyncSingleNFTInput>): Nullable<SyncAssetResponse> | Promise<Nullable<SyncAssetResponse>>;

    abstract saveSwapRobotLog(input?: Nullable<SwapRobotLogInput>): Nullable<SwapRobotLogResponse> | Promise<Nullable<SwapRobotLogResponse>>;

    abstract dontAskAgain(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract createRandomMessage(): Nullable<string> | Promise<Nullable<string>>;

    abstract linkWallet(linkInput: LinkWalletInput): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract signUpWithWallet(input?: Nullable<SignUpWithWalletInput>): Nullable<SignUpWithWalletResponse> | Promise<Nullable<SignUpWithWalletResponse>>;

    abstract confirmEmail(input?: Nullable<ConfirmEmailInput>): Nullable<ConfirmEmailResponse> | Promise<Nullable<ConfirmEmailResponse>>;

    abstract getSignedMessage(input?: Nullable<GetSignedMessageInput>): Nullable<GetSignedMessageResponse> | Promise<Nullable<GetSignedMessageResponse>>;

    abstract changePassword(input?: Nullable<ChangePasswordInput>): Nullable<ChangePasswordResponse> | Promise<Nullable<ChangePasswordResponse>>;

    abstract changeUsername(input?: Nullable<ChangeUsernameInput>): Nullable<ChangeUsernameResponse> | Promise<Nullable<ChangeUsernameResponse>>;

    abstract confirmForgotPassword(input?: Nullable<ConfirmForgotPasswordInput>): Nullable<ConfirmForgotPasswordResponse> | Promise<Nullable<ConfirmForgotPasswordResponse>>;

    abstract forgotPassword(input?: Nullable<ForgotPasswordInput>): Nullable<ForgotPasswordResponse> | Promise<Nullable<ForgotPasswordResponse>>;

    abstract signInWithAccount(input?: Nullable<SignInWithAccountInput>): Nullable<SignInWithAccountResponse> | Promise<Nullable<SignInWithAccountResponse>>;

    abstract signInWithWallet(input?: Nullable<SignInWithWalletInput>): Nullable<SignInWithWalletResponse> | Promise<Nullable<SignInWithWalletResponse>>;

    abstract resendConfirmationCode(input?: Nullable<ResendCodeInput>): Nullable<ResendCodeResponse> | Promise<Nullable<ResendCodeResponse>>;

    abstract listRentingAsset(input?: Nullable<ListRentingAssetInput>): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract cancelRentingAsset(input?: Nullable<CancelRentingInput>): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract updateRentingAsset(input?: Nullable<UpdateRentingAssetInput>): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract rentRentingAsset(input?: Nullable<RentRentingAssetInput>): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract depositToken(input: DepositTokenInput): number | Promise<number>;

    abstract withdrawToken(input: WithdrawTokenInput): string | Promise<string>;

    abstract claimToken(input: ClaimTokenInput): string | Promise<string>;

    abstract deleteUserUnverifiedEmail(input: DeleteUserUnverifiedEmailInput): DeleteUserUnverifiedEmailStatus | Promise<DeleteUserUnverifiedEmailStatus>;
}

export class ResendCodeResponse {
    isSent: boolean;
}

export class SignUpAccountResponse {
    accessToken?: Nullable<string>;
}

export class ChangeUsernameResponse {
    accessToken?: Nullable<string>;
}

export class ChangePasswordResponse {
    accessToken?: Nullable<string>;
}

export class SignInWithWalletResponse {
    isWalletLinked: boolean;
    isDontAskLink: boolean;
    accessToken?: Nullable<string>;
    email?: Nullable<string>;
    isConfirmed: boolean;
}

export class ProfileInfoResponse {
    walletAddress: string;
    nickname: string;
    email?: Nullable<string>;
    isWalletLinked?: Nullable<boolean>;
    isEmailConfirmed?: Nullable<boolean>;
    isChangedNickName?: Nullable<boolean>;
}

export class SignInWithAccountResponse {
    isWalletLinked?: Nullable<boolean>;
    isConfirmed?: Nullable<boolean>;
    accessToken?: Nullable<string>;
}

export class SignUpWithWalletResponse {
    cognitoUserId?: Nullable<string>;
}

export class ConfirmEmailResponse {
    accessToken?: Nullable<string>;
}

export class ForgotPasswordResponse {
    isSent: boolean;
}

export class ConfirmForgotPasswordResponse {
    isSet: boolean;
}

export class GetSignedMessageResponse {
    message?: Nullable<string>;
}

export class PageInfoWithOffset implements PageInfo {
    offset?: Nullable<number>;
    total?: Nullable<number>;
    limit?: Nullable<number>;
}

export class PageInfoWithCursor implements PageInfo {
    endCursor?: Nullable<string>;
    startCursor?: Nullable<string>;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total?: Nullable<number>;
}

export class HackathonInventoryEntity {
    id?: Nullable<number>;
    nftAddress?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    image?: Nullable<string>;
    type?: Nullable<number>;
    subtype?: Nullable<number>;
    tier?: Nullable<number>;
    attributes?: Nullable<string>;
    price?: Nullable<number>;
    numberOfDay?: Nullable<number>;
    startTime?: Nullable<number>;
    rentUserId?: Nullable<string>;
    isMyItem?: Nullable<boolean>;
    isListing?: Nullable<boolean>;
    owner?: Nullable<string>;
    isRenting?: Nullable<boolean>;
}

export class HackathonAssetEntity {
    id?: Nullable<number>;
    nftAddress?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    image?: Nullable<string>;
    type?: Nullable<number>;
    subtype?: Nullable<number>;
    tier?: Nullable<number>;
    attributes?: Nullable<string>;
    price?: Nullable<number>;
    numberOfDay?: Nullable<number>;
    isMyItem?: Nullable<boolean>;
    isListing?: Nullable<boolean>;
    totalCount?: Nullable<number>;
    rentUserId?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

export class HackathonRentingHistory {
    type?: Nullable<string>;
    price?: Nullable<number>;
    numberOfDay?: Nullable<number>;
    ownerUserId?: Nullable<string>;
    ownerUserName?: Nullable<string>;
    rentUserId?: Nullable<string>;
    rentUserName?: Nullable<string>;
    createdAt?: Nullable<number>;
}

export class RentingListRes {
    total: number;
    data?: Nullable<Nullable<HackathonAssetEntity>[]>;
}

export class InventoryRes {
    total: number;
    data?: Nullable<Nullable<HackathonInventoryEntity>[]>;
}

export class TokenConfig {
    claimFee: number;
    withdrawFee: number;
    minTokenWithdraw: number;
    minClaimDay: number;
}

export class TokenAggregate {
    reward: TokenRewardAggregate;
    wallet: TokenWalletAggregate;
    bot: TokenBotAggregate;
}

export class TokenRewardAggregate {
    balance: number;
    claimableAmount: number;
}

export class TokenBotAggregate {
    balance: number;
}

export class TokenWalletAggregate {
    balance: number;
}

export class TokenProcessingStatus {
    wallet: WalletStatus;
    reward: RewardStatus;
    bot: BotStatus;
}

export class WalletStatus {
    deposit: boolean;
    withdraw: boolean;
}

export class RewardStatus {
    claim: boolean;
}

export class BotStatus {
    deposit: boolean;
    withdraw: boolean;
}

export class DeleteUserUnverifiedEmailStatus {
    isSuccess: boolean;
    errors: string[];
}

export class UserEntity {
    id?: Nullable<string>;
    email?: Nullable<string>;
    isDontAskLink?: Nullable<boolean>;
    walletAddress?: Nullable<string>;
    isTmpAccount?: Nullable<boolean>;
    nickname?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

export class WalletConfig {
    depositAddress: string;
    tokenAddress: string;
    botAddress: string;
}

export type ObjectId = any;
export type JSON = any;
export type JSONObject = any;
type Nullable<T> = T | null;
