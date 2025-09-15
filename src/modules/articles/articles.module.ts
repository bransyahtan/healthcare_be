import { Module } from "@nestjs/common";
import { ArticlesResolver } from "./articles.resolver";
import { ArticlesService } from "./articles.service";

@Module({
  providers: [ArticlesService, ArticlesResolver],
})
export class ArticlesModule {}
