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
export class UpdateUserInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  dateBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  placeBirth?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  role?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photoProfile?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
