import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPaginated(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { deletedAt: null },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          categoryId: true,
          title: true,
          slug: true,
          bannerPhoto: true,
          publishedAt: true,
          status: true,
          content: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      }),
      this.prisma.article.count({ where: { deletedAt: null } }),
    ]);

    return { items, total, page, pageSize };
  }
}
