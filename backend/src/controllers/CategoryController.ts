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
  Authorized,
} from "routing-controllers";
import { Service } from "typedi";
import { CategoryService } from "../services/CategoryService";
import { Category } from "../entity/Category";
import { CategoryCreationDto } from "../dtos/CategoryCreation";
import { User } from "../entity/User";

@JsonController("/categories")
@Service()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getAll(@QueryParams() params: Partial<Category>) {
    return this.categoryService.getAll(params);
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.categoryService.getOne(id);
  }

  @Authorized()
  @Post()
  create(@Body() category: CategoryCreationDto, @CurrentUser() user: User) {
    return this.categoryService.create(category, user.id);
  }

  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() category: Partial<Category>,
    @CurrentUser() user: User
  ) {
    return this.categoryService.update(id, category, user.id);
  }

  @Delete("/:id")
  delete(@Param("id") id: number, @CurrentUser() user: User) {
    return this.categoryService.delete(id, user.id);
  }
}
