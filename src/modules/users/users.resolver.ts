import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import {
  UserEntity,
  UserResponse,
  UsersPaginatedResponse,
  UsersResponse,
} from "./entities/user.entity";
import { UsersService } from "./users.service";

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UsersResponse, { name: "users" })
  async findAll() {
    try {
      const items = await this.usersService.findAll();
      const message = items.length === 0 ? "Data kosong" : "Berhasil";
      return { message, items };
    } catch (error) {
      return { message: "Gagal", items: [] };
    }
  }

  @Query(() => UsersPaginatedResponse, { name: "usersPaginated" })
  async findPaginated(
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("pageSize", { type: () => Int, nullable: true }) pageSize?: number
  ) {
    try {
      const data = await this.usersService.findPaginated(
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

  @Query(() => UserResponse, { name: "user" })
  async findById(@Args("id", { type: () => Int }) id: number) {
    try {
      const item = await this.usersService.findById(id);
      return { message: "Berhasil", item };
    } catch (error) {
      return {
        message: error.message || "Gagal",
        item: null,
      };
    }
  }

  @Mutation(() => UserResponse, { name: "createUser" })
  async create(@Args("createUserInput") createUserInput: CreateUserInput) {
    try {
      const item = await this.usersService.create(createUserInput);
      return { message: "User berhasil dibuat", item };
    } catch (error) {
      return {
        message: error.message || "Gagal membuat user",
        item: null,
      };
    }
  }

  @Mutation(() => UserResponse, { name: "updateUser" })
  async update(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
    try {
      const item = await this.usersService.update(updateUserInput);
      return { message: "User berhasil diupdate", item };
    } catch (error) {
      return {
        message: error.message || "Gagal mengupdate user",
        item: null,
      };
    }
  }

  @Mutation(() => UserResponse, { name: "deleteUser" })
  async delete(@Args("id", { type: () => Int }) id: number) {
    try {
      const item = await this.usersService.delete(id);
      return { message: "User berhasil dihapus", item };
    } catch (error) {
      return {
        message: error.message || "Gagal menghapus user",
        item: null,
      };
    }
  }
}
