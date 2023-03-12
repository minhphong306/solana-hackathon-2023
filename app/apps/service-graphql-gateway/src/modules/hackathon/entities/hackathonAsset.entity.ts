import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';

export interface IBasePartAttributes {
  health?: number
  attack?: number
  energy?: number
  power?: number
  level?: number
  slots?: number[]
}

export interface IBaseRobotAttributes {
  Owner?: string
  IsBrokeCompleted?: boolean
  IsMintBody?: boolean
  IsMintWheel1?: boolean
  IsMintWheel2?: boolean
  IsMintGadget?: boolean
  IsMintWeapon?: boolean
  Body?: string
  Wheel1?: string
  Wheel2?: string
  Weapon?: string
  Gadget?: string
}

@Entity('hackathon_asset')
export class HackathonAsset {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false, name: "user_id"})
  public userId: string;

  @Column({nullable: false})
  @Unique(['nft'])
  public nft: string;

  @Column({nullable: false})
  public type: number;

  @Column({nullable: false, name: "sub_type"})
  public subType: number;

  @Column({nullable: false,  name: "tier"})
  public tier: number;

  @Column({nullable: false,  name: "bot_index", default: -1})
  public botIndex: number;

  @Column({nullable: false,  name: "attached_slot", default: -1})
  public attachedSlot: number;

  @Column({nullable: true})
  public name: string;

  @Column({nullable: true})
  public description: string;

  @Column({nullable: true, name: "base_attributes", type: 'jsonb'})
  public baseAttributes: IBasePartAttributes | IBaseRobotAttributes;

  @Column({nullable: true, name: "attributes", type: 'jsonb'})
  public attributes: IBasePartAttributes | IBaseRobotAttributes;

  @Column({nullable: true, name: "rent_user_id", default: null})
  public rentUserId: string;

  @Column({nullable: false,  name: "is_renting", default: false})
  public isRenting: boolean;

  @Column({nullable: false,  name: "is_listing", default: false})
  public isListing: boolean;

  @Column({nullable: false,  name: "is_continue_listing", default: false})
  public isContinueListing: boolean;

  @Column({nullable: true,  name: "price", default: null, type: "double precision"})
  public price: number;

  @Column({nullable: true,  name: "number_of_day", default: null})
  public numberOfDay: number;

  // second
  @Column({nullable: true,  name: "start_time", default: null})
  public startTime: number;

  @CreateDateColumn({
    name: "created_at",
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  public updatedAt?: Date;

  @Column({
    nullable: true
  })
  public image: string;
}

export default HackathonAsset;
