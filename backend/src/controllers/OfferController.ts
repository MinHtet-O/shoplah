import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "routing-controllers";
import { OfferService } from "../services/OfferService";
import { Offer } from "../entity/Offer";

@JsonController("/offers")
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  getAll() {
    return this.offerService.findAll();
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.offerService.findOne(id);
  }

  @Post()
  create(@Body() offer: Offer) {
    return this.offerService.create(offer);
  }

  @Put("/:id/accept")
  acceptOffer(@Param("id") id: number) {
    return this.offerService.acceptOffer(id);
  }

  @Put("/:id/reject")
  rejectOffer(@Param("id") id: number) {
    return this.offerService.rejectOffer(id);
  }
}
