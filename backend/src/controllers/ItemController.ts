import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "routing-controllers";
import { ItemService } from "../services/ItemService";
import { Item } from "../entity/Item";

@JsonController("/items")
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getAll() {
    return this.itemService.findAll();
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() item: Item) {
    return this.itemService.create(item);
  }

  @Put("/:id")
  update(@Param("id") id: number, @Body() item: Item) {
    return this.itemService.update(id, item);
  }

  @Delete("/:id")
  delete(@Param("id") id: number) {
    return this.itemService.delete(id);
  }

  @Post("/:id/buy")
  buyItem(@Param("id") id: number, @Body() buyerData: { buyerId: number }) {
    return this.itemService.buyItem(id, buyerData.buyerId);
  }
}
