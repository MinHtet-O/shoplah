import {
  JsonController,
  Get,
  Post,
  Param,
  Body,
  CurrentUser,
  Authorized,
  QueryParams,
} from "routing-controllers";
import { Service } from "typedi";
import { OfferService } from "../services/OfferService";
import { User } from "../entity/User";
import { OfferCreationDto } from "../dtos/OfferCreationDto";
import { Offer } from "../entity/Offer";

@JsonController("/offers")
@Service()
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  getAll(@QueryParams() filters: Partial<Offer>) {
    return this.offerService.getAll(filters);
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.offerService.getOne(id);
  }

  @Authorized()
  @Post()
  create(@Body() offer: OfferCreationDto, @CurrentUser() user: User) {
    return this.offerService.create(offer, user.id);
  }

  // Once Submitted, offer can not be updated
  // @Authorized()
  // @Put("/:id")
  // update(
  //   @Param("id") id: number,
  //   @Body() offer: Partial<Offer>,
  //   @CurrentUser() user: User
  // ) {
  //   return this.offerService.update(id, offer, user.id);
  // }

  // Once submitted, offer can not be deleted
  // @Authorized()
  // @Delete("/:id")
  // delete(@Param("id") id: number, @CurrentUser() user: User) {
  //   return this.offerService.delete(id, user.id);
  // }
}
