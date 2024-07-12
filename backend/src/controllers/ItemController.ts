import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  QueryParams,
  CurrentUser,
  Authorized,
  UseBefore,
  Body,
} from "routing-controllers";
import { Service } from "typedi";
import { ItemService } from "../services/ItemService";
import { User } from "../entity/User";
import { Item } from "../entity/Item";
import { AcceptOfferDto } from "../dtos/AcceptOfferDto";
import { BuyItemDto } from "../dtos/BuyItemDto";
import { MulterMiddleware } from "../middleware/MulterMiddleware";
import { Request } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ItemCreationDto } from "../dtos/ItemCreationDto";

interface ItemQueryParams extends Partial<Item> {
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

@JsonController("/items")
@Service()
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getAll(@QueryParams() params: ItemQueryParams) {
    const { sortField, sortOrder, ...filters } = params;
    console.log(filters);
    return this.itemService.getAll(filters, sortField, sortOrder);
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.itemService.getOne(id);
  }

  @Authorized()
  @Post()
  @UseBefore(MulterMiddleware) // Apply the Multer middleware
  async create(@Req() req: Request, @CurrentUser() user: User) {
    const item = plainToInstance(ItemCreationDto, req.body); // Transform plain object to DTO instance
    await validateOrReject(item); // Validate the DTO instance
    return this.itemService.create(item, user.id, req.file);
  }

  @Authorized()
  @Delete("/:id")
  delete(@Param("id") id: number, @CurrentUser() user: User) {
    return this.itemService.delete(id, user.id);
  }

  @Authorized()
  @Post("/buy")
  async buyItem(@Body() buyItemDto: BuyItemDto, @CurrentUser() user: User) {
    return this.itemService.buyItem(buyItemDto.item_id, user.id);
  }

  @Authorized()
  @Post("/accept-offer")
  async acceptOffer(
    @Body() acceptOffer: AcceptOfferDto,
    @CurrentUser() user: User
  ) {
    return this.itemService.acceptOffer(acceptOffer.offer_id, user.id);
  }
}
