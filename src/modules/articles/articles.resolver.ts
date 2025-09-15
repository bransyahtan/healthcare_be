import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { ArticlesService } from "./articles.service";
import {
  ArticleEntity,
  ArticlesPaginatedResponse,
} from "./entities/article.entity";

@Resolver(() => ArticleEntity)
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Query(() => ArticlesPaginatedResponse, { name: "articlesPaginated" })
  async findPaginated(
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("pageSize", { type: () => Int, nullable: true }) pageSize?: number
  ) {
    try {
      const data = await this.articlesService.findPaginated(
        page ?? 1,
        pageSize ?? 10
      );
      const message = data.items.length === 0 ? "Data kosong" : "Berhasil";
      return { message, data };
    } catch (error) {
      return {
        message: "Gagal",
        data: {
          items: [],
          total: 0,
          page: page ?? 1,
          pageSize: pageSize ?? 10,
        },
      };
    }
  }
}
