import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
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
    });
  }

  async findPaginated(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null },
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
      this.prisma.user.count({ where: { deletedAt: null } }),
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
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

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    return user;
  }

  async create(createUserInput: CreateUserInput) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserInput.email },
          { username: createUserInput.username },
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new Error("Email atau username sudah digunakan");
    }

    const hashedPassword = await this.hashPassword(createUserInput.password);

    return this.prisma.user.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
      },
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

  async update(updateUserInput: UpdateUserInput) {
    const { id, ...updateData } = updateUserInput;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    if (updateData.email || updateData.username) {
      const duplicateUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(updateData.email ? [{ email: updateData.email }] : []),
                ...(updateData.username
                  ? [{ username: updateData.username }]
                  : []),
              ],
            },
            { deletedAt: null },
          ],
        },
      });

      if (duplicateUser) {
        throw new Error("Email atau username sudah digunakan");
      }
    }

    // Hash password jika ada
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
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

  async delete(id: number) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
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
