import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  QueryParams,
  CurrentUser,
} from "routing-controllers";
import { Service } from "typedi";
import { ItemService } from "../services/ItemService";
import { Item } from "../entity/Item";
import { User } from "../entity/User";

@JsonController("/items")
@Service()
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getAll(@QueryParams() params: Partial<Item>) {
    return this.itemService.getAll(params);
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.itemService.getOne(id);
  }

  // Other methods remain the same

  @Post()
  create(@Body() item: Partial<Item>, @CurrentUser() user: User) {
    return this.itemService.create(item, user.id);
  }

  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() item: Partial<Item>,
    @CurrentUser() user: User
  ) {
    return this.itemService.update(id, item, user.id);
  }

  @Delete("/:id")
  delete(@Param("id") id: number, @CurrentUser() user: User) {
    return this.itemService.delete(id, user.id);
  }

  @Post("/:id/buy")
  buyItem(@Param("id") id: number, @CurrentUser() user: User) {
    return this.itemService.buyItem(id, user.id);
  }
}
