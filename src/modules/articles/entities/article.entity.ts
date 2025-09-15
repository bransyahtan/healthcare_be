import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ArticleEntity {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  categoryId: number;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  bannerPhoto?: string | null;

  @Field({ nullable: true })
  publishedAt?: Date | null;

  @Field()
  status: string;

  @Field()
  content: string;

  @Field(() => Int)
  authorId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date | null;
}

@ObjectType()
export class ArticlesPaginated {
  @Field(() => [ArticleEntity])
  items: ArticleEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class ArticlesPaginatedResponse {
  @Field()
  message: string;

  @Field(() => ArticlesPaginated)
  data: ArticlesPaginated;
}
