import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  NotFoundError,
} from "routing-controllers";
import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";

@JsonController("/items")
export class ItemController {
  private itemRepository = AppDataSource.getRepository(Item);

  @Get("/")
  async getAll() {
    return this.itemRepository.find();
  }

  @Get("/:id")
  async getOne(@Param("id") id: number) {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
    return item;
  }

  @Post("/")
  @HttpCode(201)
  async create(@Body() item: Item) {
    return this.itemRepository.save(item);
  }

  @Put("/:id")
  async update(@Param("id") id: number, @Body() item: Item) {
    const existingItem = await this.itemRepository.findOne({ where: { id } });
    if (!existingItem) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
    await this.itemRepository.update(id, item);
    return this.itemRepository.findOne({ where: { id } });
  }

  @Delete("/:id")
  @HttpCode(204)
  async delete(@Param("id") id: number) {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundError(`Item with id ${id} not found`);
    }
  }
}
