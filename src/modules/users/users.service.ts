import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      // Jangan pernah select password
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        dateBirth: true,
        placeBirth: true,
        role: true,
        photoProfile: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async findPaginated(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          dateBirth: true,
          placeBirth: true,
          role: true,
          photoProfile: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { items, total, page, pageSize };
  }
}
