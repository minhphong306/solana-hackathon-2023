import {HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Between, getRepository, ILike, Repository} from 'typeorm';
import {HackathonAsset} from './entities/hackathonAsset.entity';
import HackathonHistory from "./entities/hackathonHistory.entity";
import {
  CancelRentingInput,
  HackathonAssetEntity,
  HackathonInventoryEntity,
  HackathonRentingHistory,
  HackathonRentingInput,
  InventoryInput,
  InventoryRes,
  ListRentingAssetInput,
  RentingListRes,
  RentRentingAssetInput,
  UpdateRentingAssetInput
} from '../../graphql.schema';
import {ILoginJwtPayload} from "../auth/interfaces/jwt-payload.interface";
import {OnChainData} from "./types/onchain-data";
import {INVENTORY_STATUS} from './constants/inventory-status.constants';
import {AuthConstant} from "@mp-workspace/proto";
import {ClientGrpc} from "@nestjs/microservices";
import {AuthService} from "../auth/auth.service";
import {Connection, ParsedTransactionWithMeta, PublicKey} from "@solana/web3.js";
import {decodeItem} from "../../utils/extend-borsh";

const INT_MAX = 1e9 + 1;

@Injectable()
export class HackathonAssetService {
  private usingProgram: boolean;
  private readonly logger = new Logger(HackathonAssetService.name);
  private networkUrl = 'https://api.devnet.solana.com';

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(HackathonAsset) private hackathonAssetRepository: Repository<HackathonAsset>,
    @InjectRepository(HackathonHistory) private hackathonHistoryRepository: Repository<HackathonHistory>,
    @Inject(AuthConstant.PackageName) private client: ClientGrpc,
  ) {
    this.usingProgram = false;
  }



  async getRentingList(input: HackathonRentingInput): Promise<RentingListRes> {
    const condition = {};
    if (!input.price) {
      input.price = {};
      input.price.min = 0;
      input.price.max = INT_MAX;
    }
    if (!input.price.min) {
      input.price.min = 0;
    }
    if (!input.price.max) {
      input.price.max = INT_MAX;
    }

    if (!input.rentTime) {
      input.rentTime = {};
      input.rentTime.min = 0;
      input.rentTime.max = INT_MAX;
    }
    if (!input.rentTime.min) {
      input.rentTime.min = 0;
    }
    if (!input.rentTime.max) {
      input.rentTime.max = INT_MAX;
    }
    if (!input.limit) {
      input.limit = INT_MAX;
    }
    if (!input.page) {
      input.page = 1;
    }

    if (input.subType) {
      condition['subType'] = input.subType;
    }
    if (input.type) {
      condition['type'] = input.type;
    }
    if (input.tier) {
      condition['tier'] = input.tier;
    }

    if (input.search) {
      condition['name'] = ILike(`%${input.search}%`);
    }

    console.log(condition);

    condition['price'] = Between(input.price.min, input.price.max);
    condition['numberOfDay'] = Between(input.rentTime.min, input.rentTime.max);
    condition['isListing'] = true;

    const order = {};

    if (input.orderBy && input.order) {
      order[`${input.orderBy}`] = input.order;
    }

    const data = await this.hackathonAssetRepository.find({
      where: [condition],
      take: input.limit,
      skip: input.limit * (input.page - 1),
      order: order,
    });

    const total = await this.hackathonAssetRepository.count({
      where: [condition]
    });

    const resp: HackathonAssetEntity[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      let attributes;
      if (item.attributes) {
        attributes = JSON.stringify(item.attributes);
      }

      const convertedItem: HackathonAssetEntity = {
        id: item.id,
        name: item.name,
        type: item.type,
        tier: item.tier,
        attributes,
        image: item.image,
        price: item.price,
        nftAddress: item.nft,
        createdAt: item.createdAt,
        numberOfDay: item.numberOfDay,
        subtype: item.subType,
        updatedAt: item.updatedAt,
        rentUserId: item.rentUserId,
      };

      resp.push(convertedItem);
    }

    const response: InventoryRes = {
      data: resp,
      total
    };

    return response;
  }

  async getRentingDetail(nft: string): Promise<HackathonAssetEntity> {
    const item = await this.hackathonAssetRepository.findOne({
      where: {
        nft: nft,
        isListing: true,
      },
    });

    if (!item) {
      console.error('GetRentingDetail err: Item not found!', nft);
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    let attributes = '{}';
    if (item.attributes) {
      attributes = JSON.stringify(item.attributes);
    }

    return {
      id: item.id,
      name: item.name,
      type: item.type,
      tier: item.tier,
      attributes: attributes,
      description: item.description,
      image: item.image,
      price: item.price,
      nftAddress: item.nft,
      createdAt: item.createdAt,
      numberOfDay: item.numberOfDay,
      subtype: item.subType,
      updatedAt: item.updatedAt,
      rentUserId: item.rentUserId,
    };
  }

  async getRentingHistory(nft: string): Promise<HackathonRentingHistory[]> {
    const data = await this.hackathonHistoryRepository.find({
      where: {
        nft: nft,
      },
      order: {
        createdAt: 'ASC',
      }
    });

    const resp: HackathonRentingHistory[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      console.log('time: ', item.createdAt.getTime());

      const ownerUserName = (await this.authService.findUserById(item.ownerUserId)).nickname;
      let rentUserName = null;
      if (item.rentUserId) {
        rentUserName = (await this.authService.findUserById(item.rentUserId)).nickname;
      }
      resp.push({
        type: item.action,
        numberOfDay: item.numberOfDay,
        price: item.price,
        ownerUserId: item.ownerUserId,
        ownerUserName,
        rentUserId: item.rentUserId,
        rentUserName,
        createdAt: Math.floor(item.createdAt.getTime() / 1000),
      });
    }
    return resp;
  }

  async listRentingAsset(jwtPayload: ILoginJwtPayload, input: ListRentingAssetInput): Promise<boolean> {
    // parse data
    let onChainData: OnChainData = {
      isContinueListing: false,
      nftAddress: "",
      numberOfDay: 0,
      ownerAddress: "",
      price: 0,
      rentAddress: "",
      startDate: 0
    };
    if (this.usingProgram) {
      onChainData = await this.getOnChainData(input.tx);
    } else {
      onChainData.price = input.price;
      onChainData.numberOfDay = input.numberOfDay;
      onChainData.isContinueListing = input.isContinueListing;
      onChainData.nftAddress = input.nftAddress;
    }

    // find asset by nft address
    const foundAsset = await this.getAssetByNft(input.nftAddress);
    if (!foundAsset) {
      throw new HttpException('Not found asset', HttpStatus.BAD_REQUEST);
    }

    // validate input
    // - if is_listing || is_renting => bad request
    if (foundAsset.isListing) {
      throw new HttpException('Item already been listed', HttpStatus.BAD_REQUEST);
    }
    // - if item not belong to user => bad request
    if (foundAsset.userId !== jwtPayload.username) {
      throw new HttpException('Item not belong to you', HttpStatus.BAD_REQUEST);
    }

    // - if is Renting
    // if (foundAsset.isRenting && foundAsset.startTime > 0) {
    //   throw new HttpException('Item already been Renting by another user', HttpStatus.BAD_REQUEST);
    // }


    // update asset: is_listing = true
    const updateRes = await this.hackathonAssetRepository.update({id: foundAsset.id}, {
      isListing: true,
      price: onChainData.price,
      numberOfDay: onChainData.numberOfDay,
      isContinueListing: onChainData.isContinueListing,
    });
    this.logger.log(`Update result: ${JSON.stringify(updateRes)}`);

    const model = {
      nft: input.nftAddress,
      price: input.price,
      ownerUserId: jwtPayload.username,
      numberOfDay: input.numberOfDay,
      action: "List",
      metadata: input.tx,
    };

    const history = this.hackathonHistoryRepository.create(model);
    await this.hackathonHistoryRepository.save(history);

    return true;
  }

  async cancelRentingAsset(jwtPayload: ILoginJwtPayload, input: CancelRentingInput): Promise<boolean> {
    // parse data
    let onChainData: OnChainData = {
      isContinueListing: false,
      nftAddress: "",
      numberOfDay: 0,
      ownerAddress: "",
      price: 0,
      rentAddress: "",
      startDate: 0
    };
    if (this.usingProgram) {
      onChainData = await this.getOnChainData(input.tx);
    } else {
      onChainData.nftAddress = input.nft;
    }

    // find asset by nft address
    const foundAsset = await this.getAssetByNft(input.nft);
    if (!foundAsset) {
      throw new HttpException('Not found asset', HttpStatus.BAD_REQUEST);
    }

    // validate input
    // - if is_listing || is_renting => bad request
    if (!foundAsset.isListing) {
      throw new HttpException('Item hasn\'t been listed', HttpStatus.BAD_REQUEST);
    }
    // - if item not belong to user => bad request
    if (foundAsset.userId !== jwtPayload.username) {
      throw new HttpException('Item not belong to you', HttpStatus.BAD_REQUEST);
    }

    // update asset: is_listing = true
    const updateRes = await this.hackathonAssetRepository.update({id: foundAsset.id}, {
      isListing: false,
    });
    this.logger.log(`Update result: ${JSON.stringify(updateRes)}`);

    const history = this.hackathonHistoryRepository.create({
      nft: input.nft,
      ownerUserId: jwtPayload.username,
      action: "Cancel listing",
      metadata: input.tx,
    });
    await this.hackathonHistoryRepository.save(history);

    return true;
  }

  async updateRentingAsset(jwtPayload: ILoginJwtPayload, input: UpdateRentingAssetInput): Promise<boolean> {
    // parse data
    let onChainData: OnChainData = {
      isContinueListing: false,
      nftAddress: "",
      numberOfDay: 0,
      ownerAddress: "",
      price: 0,
      rentAddress: "",
      startDate: 0
    };
    if (this.usingProgram) {
      onChainData = await this.getOnChainData(input.tx);
    } else {
      onChainData.nftAddress = input.nft;
      onChainData.price = input.price;
      onChainData.numberOfDay = input.numberOfDay;
      onChainData.isContinueListing = input.isContinueListing;
    }

    // find asset by nft address
    const foundAsset = await this.getAssetByNft(input.nft);
    if (!foundAsset) {
      throw new HttpException('Not found asset', HttpStatus.BAD_REQUEST);
    }

    // validate input
    // - if is_listing || is_renting => bad request
    if (!foundAsset.isListing) {
      throw new HttpException('Item hasn\'t been listed', HttpStatus.BAD_REQUEST);
    }
    // - if item not belong to user => bad request
    if (foundAsset.userId !== jwtPayload.username) {
      throw new HttpException('Item not belong to you', HttpStatus.BAD_REQUEST);
    }

    // update asset: is_listing = true
    const updateRes = await this.hackathonAssetRepository.update({id: foundAsset.id}, {
      price: onChainData.price,
      numberOfDay: onChainData.numberOfDay,
      isContinueListing: onChainData.isContinueListing
    });
    this.logger.log(`Update result: ${JSON.stringify(updateRes)}`);

    const history = this.hackathonHistoryRepository.create({
      nft: input.nft,
      price: input.price,
      ownerUserId: jwtPayload.username,
      numberOfDay: input.numberOfDay,
      action: "Update listing",
      metadata: input.tx,
    });
    await this.hackathonHistoryRepository.save(history);

    return true;
  }

  async rentRentingAsset(jwtPayload: ILoginJwtPayload, input: RentRentingAssetInput): Promise<boolean> {
    // parse data
    let onChainData: OnChainData = {
      isContinueListing: false,
      nftAddress: "",
      numberOfDay: 0,
      ownerAddress: "",
      price: 0,
      rentAddress: "",
      startDate: 0
    };
    if (this.usingProgram) {
      onChainData = await this.getOnChainData(input.tx);
    } else {
      onChainData.nftAddress = input.nft;
    }

    // find asset by nft address
    const foundAsset = await this.getAssetByNft(input.nft);
    if (!foundAsset) {
      throw new HttpException('Not found asset', HttpStatus.BAD_REQUEST);
    }

    // validate input
    // - if is_listing || is_renting => bad request
    if (!foundAsset.isListing) {
      throw new HttpException('Item hasn\'t been listed', HttpStatus.BAD_REQUEST);
    }
    // - if item not belong to user => bad request
    if (foundAsset.userId === jwtPayload.username) {
      throw new HttpException('You can\'t rent your item', HttpStatus.BAD_REQUEST);
    }

    // TODO: Check if item already been rent

    const nowUnix = parseInt(String((new Date()).getTime() / 1000));

    // update asset: is_listing = true
    const updateRes = await this.hackathonAssetRepository.update({id: foundAsset.id}, {
      rentUserId: jwtPayload.username,
      startTime: nowUnix,
      isListing: false,
      isRenting: true,
    });
    this.logger.log(`Update result: ${JSON.stringify(updateRes)}`);

    const history = this.hackathonHistoryRepository.create({
      nft: input.nft,
      price: foundAsset.price,
      ownerUserId: foundAsset.userId,
      numberOfDay: foundAsset.numberOfDay,
      action: "Rent",
      metadata: input.tx,
      rentUserId: jwtPayload.username
    });
    await this.hackathonHistoryRepository.save(history);

    return true;
  }

  async getOnChainData(tx: string): Promise<OnChainData> {
    const resp: OnChainData = {
      isContinueListing: false,
      nftAddress: "",
      numberOfDay: 0,
      ownerAddress: "",
      price: 0,
      rentAddress: "",
      startDate: 0
    };

    return resp;
  }

  async getAssetByNft(nft: string): Promise<HackathonAsset> {
    return this.hackathonAssetRepository.findOne({nft: nft});
  }

  async inventoryList(jwtPayload: ILoginJwtPayload, input: InventoryInput): Promise<InventoryRes> {
    if (typeof input.status === undefined) {
      throw new HttpException('Missing status input at inventory Query', HttpStatus.BAD_REQUEST);
    }

    if (!input.limit) {
      input.limit = INT_MAX;
    }
    if (!input.page) {
      input.page = 1;
    }

    const order = {};
    if (input.orderBy && input.order) {
      order[`${input.orderBy}`] = input.order;
    }

    let wheres = "";
    const args = {};
    const nowUnix = parseInt(String((new Date()).getTime() / 1000));

    switch (input.status) {
    case undefined:
      wheres = "((user_id = :userId) or (rent_user_id = :userId and is_renting = true and start_time+number_of_day*86400 <= :nowUnix))";

      args["userId"] = jwtPayload.username;
      args["nowUnix"] = nowUnix;

      break;
    case INVENTORY_STATUS.listing:
      wheres = "( user_id = :userId and is_listing = true)";
      args["userId"] = jwtPayload.username;

      break;
    case INVENTORY_STATUS.renting:
      wheres = "(rent_user_id = :userId) and (is_renting = true and start_time+number_of_day*86400 > :nowUnix)";
      args["userId"] = jwtPayload.username;
      args["nowUnix"] = nowUnix;

      break;

    case INVENTORY_STATUS.all:
      wheres = "((user_id = :userId) or (rent_user_id = :userId and is_renting = true and start_time+number_of_day*86400 > :nowUnix))";

      args["userId"] = jwtPayload.username;
      args["nowUnix"] = nowUnix;

      break;
    }



    if (input.subType) {
      wheres += " and (sub_type = :subType) ";
      args["subType"] = input.subType;
    }

    if (input.type) {
      wheres += " and (type = :type) ";
      args["type"] = input.type;
    }
    if (input.tier) {
      wheres += " and (tier = :tier) ";
      args["tier"] = input.tier;
    }

    if (input.search) {
      wheres += " and ( name like :search or description like :search ) ";
      args["search"] = `%${input.search}%`;
    }

    const offset = (input.page - 1) * input.limit;
    const data = await getRepository(HackathonAsset).
      createQueryBuilder().
      where(wheres, args).
      limit(input.limit).
      offset(offset).
      orderBy(order).
      getMany();
    const resp: HackathonInventoryEntity[] = [];

    const total = await getRepository(HackathonAsset).
      createQueryBuilder().
      where(wheres, args).
      getCount();

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      let attributes = '{}';
      if (item.attributes) {
        attributes = JSON.stringify(item.attributes);
      }

      const convertedItem: HackathonInventoryEntity = {
        id: item.id,
        name: item.name,
        type: item.type,
        tier: item.tier,
        attributes: attributes,
        image: item.image,
        price: item.price,
        nftAddress: item.nft,
        numberOfDay: item.numberOfDay,
        subtype: item.subType,
        isMyItem: false,
        startTime: item.startTime,
        rentUserId: item.rentUserId,
      };

      if (item.userId === jwtPayload.username) {
        convertedItem.isMyItem = true;
      }

      if (item.startTime+ item.numberOfDay*86400 <= nowUnix && item.rentUserId
      ) {
        convertedItem.isRenting = true;
      } else {
        convertedItem.isRenting = false;
      }

      resp.push(convertedItem);
    }

    const response: InventoryRes = {
      total,
      data: resp
    };

    return response;

  }

  async getInventoryDetail(jwtPayload: ILoginJwtPayload, nft: string): Promise<HackathonInventoryEntity> {
    const item = await this.hackathonAssetRepository.findOne({
      where: {
        nft: nft,
      },
    });

    if (!item) {
      console.error('GetInventoryDetail err: Item not found!', nft);
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    let attributes = '{}';
    if (item.attributes) {
      attributes = JSON.stringify(item.attributes);
    }

    // Fill owner
    const profileInfo = await this.authService.profileInfo(jwtPayload);
    console.log('Profile info: ', JSON.stringify(profileInfo));

    return {
      id: item.id,
      name: item.name,
      type: item.type,
      tier: item.tier,
      attributes: attributes,
      description: item.description,
      isMyItem: item.userId === jwtPayload.username,
      isListing: item.isListing,
      isRenting: item.isRenting,
      image: item.image,
      price: item.price,
      nftAddress: item.nft,
      numberOfDay: item.numberOfDay,
      subtype: item.subType,
      owner: profileInfo.nickname,
      rentUserId: item.rentUserId,
    };
  }

  async rentingListTotal(): Promise<number> {
    return this.hackathonAssetRepository.count({
      where: {

      }
    });
  }

  async getTxInfo() {
    const tx = "4vvexMAPWtedkaSexTNcakLVzrEgNa8NoDuBSWnMmxwqgTecXSDLFsw6cm49FmjfeuvDS79KemCWT9TJHnjnMxSn";
    const data = await this.getRawOnchainTxData(tx);
    // console.log('Data got: ', JSON.stringify(data))

    // get pda
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pda = data.meta.innerInstructions[0].instructions[0].parsed.info.newAccount;
    console.log('PDA got: ', pda);

    // get pda data
    const pdaBuffers = await this.getPDAData(pda);
    console.log('pdaBuffers: ', JSON.stringify(pdaBuffers));

    const parsedItem = decodeItem(pdaBuffers);
    console.log(JSON.stringify(parsedItem));

    return JSON.stringify(parsedItem);
  }

  async getRawOnchainTxData(tx: string): Promise<ParsedTransactionWithMeta> {
    try {
      const connection = new Connection(this.networkUrl, 'confirmed');
      const confirmedTx = await connection.getParsedTransaction(tx, "confirmed");
      this.logger.log("tx info: ", JSON.stringify(confirmedTx));
      return confirmedTx;
    } catch (e) {
      this.logger.error(`Got error when get parsedTransaction: ${e.message}`);
      throw e;
    }
  }

  async getPDAData(pda: string) {
    try {
      const connection = new Connection(this.networkUrl, 'confirmed');
      const accInfo = await connection.getAccountInfo(new PublicKey(pda), "confirmed");
      this.logger.log("tx info: ", JSON.stringify(accInfo));
      return accInfo.data;
    } catch (e) {
      this.logger.error(`Got error when get parsedTransaction: ${e.message}`);
      throw e;
    }
  }

}
