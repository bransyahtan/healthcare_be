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

  // Jangan expose password ke GraphQL

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
