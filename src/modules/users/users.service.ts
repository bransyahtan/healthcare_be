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
}
