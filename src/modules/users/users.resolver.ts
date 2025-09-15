import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { UserEntity, UsersPaginated } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity], { name: "users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UsersPaginated, { name: "usersPaginated" })
  findPaginated(
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("pageSize", { type: () => Int, nullable: true }) pageSize?: number
  ) {
    return this.usersService.findPaginated(page ?? 1, pageSize ?? 10);
  }
}
