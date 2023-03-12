import {IsNotEmpty} from 'class-validator';

export class HackathonRentingHistory {
  @IsNotEmpty()
    type: string;

  @IsNotEmpty()
    price: number;

  @IsNotEmpty()
    numberOfDay: number;

  @IsNotEmpty()
    ownerUserId: string;

  rentUserId: string;

  @IsNotEmpty()
    createdAt: number;
}
