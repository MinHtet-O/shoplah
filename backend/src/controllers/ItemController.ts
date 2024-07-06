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
import { ItemService } from "../services/ItemService";
import { User } from "../entity/User";
import { ItemCreationDto } from "../dtos/ItemCreationDto";
import { Item } from "../entity/Item";
import { AcceptOfferDto } from "../dtos/AcceptOfferDto";
import { BuyItemDto } from "../dtos/BuyItemDto";

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

  @Authorized()
  @Post()
  create(@Body() item: ItemCreationDto, @CurrentUser() user: User) {
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

  @Post("/buy")
  @Authorized()
  async buyItem(@Body() buyItemDto: BuyItemDto, @CurrentUser() user: User) {
    return this.itemService.buyItem(buyItemDto.itemId, user.id);
  }

  @Post("/accept-offer")
  @Authorized()
  async acceptOffer(
    @Body() acceptOfferDto: AcceptOfferDto,
    @CurrentUser() user: User
  ) {
    return this.itemService.acceptOffer(
      acceptOfferDto.itemId,
      acceptOfferDto.offerId,
      user.id
    );
  }
}
