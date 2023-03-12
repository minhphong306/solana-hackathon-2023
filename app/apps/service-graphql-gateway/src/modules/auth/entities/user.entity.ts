import {Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn} from 'typeorm';

@Entity('users')
class Users {
  @PrimaryColumn({ nullable: false })
  public id: string;

  @Column({ nullable: false })
  @Unique(['email'])
  public email: string;

  @Column({ nullable: false })
  @Unique(['nickname'])
  public nickname: string;

  @Column({ nullable: false, name: 'encrypted_password' })
  public encryptedPassword: string;

  @Column({ nullable: true , name: 'wallet_address'})
  public walletAddress: string;

  @Column({ nullable: false, default: true , name: 'is_tmp_account'})
  public isTmpAccount: boolean;

  @Column({ nullable: false, default: false , name: 'is_changed_nickname'})
  public isChangedNickName: boolean;

  @Column({
    nullable: false,
    default: true, comment: 'Value for don\'t ask again popup',
    name: 'is_dont_ask_link'
  })
  public isDontAskLink: boolean;

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

export default Users;
