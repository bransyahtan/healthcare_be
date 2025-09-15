import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import {
  UserEntity,
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
}
