import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
    email: string;

  constructor(email: string) {
    this.email = email;
  }
}
