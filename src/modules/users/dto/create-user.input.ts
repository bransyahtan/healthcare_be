import { Field, InputType, Int } from "@nestjs/graphql";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  dateBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  placeBirth?: string;

  @Field(() => Int)
  @IsInt()
  role: number; // 1 admin, 2 doctor, 3 author

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photoProfile?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
