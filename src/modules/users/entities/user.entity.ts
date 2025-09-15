import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserEntity {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  dateBirth?: Date | null;

  @Field({ nullable: true })
  placeBirth?: string | null;

  @Field(() => Int)
  role: number;

  @Field({ nullable: true })
  photoProfile?: string | null;

  @Field({ nullable: true })
  phoneNumber?: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date | null;
}

@ObjectType()
export class UsersPaginated {
  @Field(() => [UserEntity])
  items: UserEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class UsersResponse {
  @Field()
  message: string;

  @Field(() => [UserEntity])
  items: UserEntity[];
}

@ObjectType()
export class UsersPaginatedResponse {
  @Field()
  message: string;

  @Field(() => UsersPaginated)
  data: UsersPaginated;
}
