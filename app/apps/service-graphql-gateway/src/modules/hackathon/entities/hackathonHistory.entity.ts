import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('hackathon_history')
export class HackathonHistory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false, name: "owner_user_id"})
  public ownerUserId: string;

  @Column({nullable: false})
  public nft: string;

  @Column({nullable: true, name: "rent_user_id", default: null})
  public rentUserId: string;

  @Column({nullable: false})
  public action: string;

  @Column({nullable: true,  name: "price", default: null, type: "double precision"})
  public price: number;

  @Column({nullable: true,  name: "number_of_day", default: null})
  public numberOfDay: number;

  @Column({nullable: false})
  public metadata: string;

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

}

export default HackathonHistory;
