import {
  JsonController,
  Post,
  Body,
  Get,
  Param,
  CurrentUser,
  Authorized,
} from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../services/UserService";
import { User } from "../entity/User";

@JsonController("/users")
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/:id")
  @Authorized()
  getOne(@Param("id") id: number) {
    return this.userService.getOne(id);
  }

  @Get("/me")
  @Authorized()
  getMe(@CurrentUser() user: User) {
    return this.userService.getOne(user.id);
  }
}
